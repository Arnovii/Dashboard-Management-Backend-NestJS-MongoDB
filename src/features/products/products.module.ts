import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    // Registramos el modelo en el Shard 1
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }], 'SHARD_1'),
    // Registramos el modelo en el Shard 2
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }], 'SHARD_2'),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
