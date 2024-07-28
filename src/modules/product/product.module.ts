import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';
import { ProductService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [],
})
export class ProductModule {}
