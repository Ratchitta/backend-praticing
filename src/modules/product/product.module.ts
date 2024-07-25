import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [],
})
export class ProductModule {}
