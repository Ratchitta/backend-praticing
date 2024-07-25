import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { ProductService } from '../services/product.service';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { Product } from '../entities/product.entity';

@Controller('products')
@UseInterceptors(TransformInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ResponseMessage('Get all products successfully')
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Get product by id successfully')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post()
  @ResponseMessage('Create product successfully')
  create(@Body() products: Product[]): Promise<Product>[] {
    const results = products.map(async (product) => {
      return await this.productService.create(product);
    });

    return results;
  }

  @Delete(':id')
  @ResponseMessage('Delete product by id successfully')
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
