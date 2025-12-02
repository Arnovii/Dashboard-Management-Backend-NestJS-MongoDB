import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './features/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    // Conexión 1: Shard de Tecnología (por ejemplo)
    MongooseModule.forRoot('mongodb://10.124.116.51:27018,10.124.116.203:27017/productos_db?replicaSet=rs1&w=1', {
      connectionName: 'SHARD_1',
    }),
    // Conexión 2: Shard de Hogar/Ropa
    MongooseModule.forRoot('mongodb://10.124.116.131:27017,10.124.116.62:27017/productos_db?replicaSet=rs2&w=1', {
      connectionName: 'SHARD_2',
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

