import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [
    // Registramos los modelos de Productos en ambos shards para poder leerlos
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }], 'SHARD_1'),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }], 'SHARD_2'),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule { }
