import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ProductController } from './product.controller';
import { Product } from '../../common/entities/product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [],
})
export class ProductModule {}
