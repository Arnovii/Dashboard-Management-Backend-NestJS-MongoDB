import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Product.name, 'SHARD_1') private productModel1: Model<Product>,
    @InjectModel(Product.name, 'SHARD_2') private productModel2: Model<Product>,
  ) {}

  async getDashboardStats() {
    // Obtenemos todos los productos (podría optimizarse con aggregate, pero findAll es seguro por ahora)
    const [p1, p2] = await Promise.all([
      this.productModel1.find().exec(),
      this.productModel2.find().exec(),
    ]);
    
    const allProducts = [...p1, ...p2];

    // CÁLCULOS PARA EL FRONTEND
    
    // 1. Total Inventario (Cantidad de items físicos)
    const totalStock = allProducts.reduce((acc, curr) => acc + curr.quantity, 0);

    // 2. Valor del Inventario (Dinero)
    const totalValue = allProducts.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    // 3. Productos con bajo stock (Menos de 5 unidades) -> Para alertas
    const lowStockProducts = allProducts.filter(p => p.quantity < 5).length;

    // 4. Distribución por Categoría (Para Gráfico de Torta/Pie Chart)
    const categoryDist = allProducts.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
    }, {});

    // Formateamos para que React lo consuma fácil en librerías como Recharts
    // Transformamos { "Tecno": 10, "Ropa": 5 } a [{ name: "Tecno", value: 10 }, ...]
    const chartData = Object.keys(categoryDist).map(key => ({
        name: key,
        value: categoryDist[key]
    }));

    return {
        kpis: {
            totalProducts: allProducts.length,
            totalStock,
            totalValue: parseFloat(totalValue.toFixed(2)), // Redondeamos a 2 decimales
            lowStockAlerts: lowStockProducts
        },
        chartData
    };
  }
}