import { Injectable } from '@nestjs/common';
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
    // Scatter-Gather: Buscamos en ambos y unimos
    const [products1, products2] = await Promise.all([
      this.productModel1.find().exec(),
      this.productModel2.find().exec(),
    ]);
    return [...products1, ...products2];
  }
}

  