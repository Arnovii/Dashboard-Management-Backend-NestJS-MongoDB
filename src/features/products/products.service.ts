import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    // Inyectamos ambos modelos especificando la conexión
    @InjectModel(Product.name, 'SHARD_1') private productModel1: Model<Product>,
    @InjectModel(Product.name, 'SHARD_2') private productModel2: Model<Product>,
  ) {}

  // Lógica de Fragmentación: Decide qué modelo usar según la categoría
  private getTargetModel(category: string): Model<Product> {
    const shard1Categories = ['Tecnologia', 'Electronica', 'Computacion'];
    
    if (shard1Categories.includes(category)) {
      return this.productModel1; // Va a DB 1
    } else {
      return this.productModel2; // Va a DB 2 (Todo lo demás: Ropa, Hogar, etc.)
    }
  }
  
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const model = this.getTargetModel(createProductDto.category);
    const createdProduct = new model(createProductDto);
    return createdProduct.save();
  }

async findAll(): Promise<Product[]> {
    const [p1, p2] = await Promise.all([
      this.productModel1.find().exec(),
      this.productModel2.find().exec(),
    ]);
    // Ordenamos por fecha de creación o nombre para que el frontend no vea saltos
    return [...p1, ...p2].sort((a: any, b: any) => b.createdAt - a.createdAt);
  }

  async findOne(id: string): Promise<Product> {
    // Buscamos en paralelo en ambos shards
    const [res1, res2] = await Promise.all([
      this.productModel1.findById(id).exec(),
      this.productModel2.findById(id).exec(),
    ]);

    const product = res1 || res2;
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // NOTA: No permitimos cambiar la categoría aquí para evitar mover datos entre shards (complejidad extra)
    if (updateProductDto.category) {
       delete updateProductDto.category; 
    }

    // Intentamos actualizar en ambos. Si no existe devuelve null, si existe devuelve el doc nuevo
    const [res1, res2] = await Promise.all([
      this.productModel1.findByIdAndUpdate(id, updateProductDto, { new: true }).exec(),
      this.productModel2.findByIdAndUpdate(id, updateProductDto, { new: true }).exec(),
    ]);

    const updated = res1 || res2;
    if (!updated) throw new NotFoundException(`No se pudo actualizar. ID ${id} no encontrado`);
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    // Intentamos borrar en ambos
    const [res1, res2] = await Promise.all([
      this.productModel1.findByIdAndDelete(id).exec(),
      this.productModel2.findByIdAndDelete(id).exec(),
    ]);

    if (!res1 && !res2) throw new NotFoundException(`Producto ${id} no encontrado para eliminar`);
    return { message: 'Producto eliminado correctamente' };
  }
}
  