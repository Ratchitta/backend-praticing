import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { TransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { ProductDto } from '../product.dto';
import { ProductService } from '../services/product.service';

class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly stock: number;
}

class CreateProductsInput {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  readonly products: CreateProductDto[];
}

class UpdateProductByIdInput {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;

  @IsNumber()
  @Min(0)
  readonly stock: number;
}

class UpdateProductsInput {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  readonly products: ProductDto[];
}

@Controller('products')
@UseInterceptors(TransformInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ResponseMessage('Get all products successfully')
  findAll(): Promise<ProductDto[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Get product by id successfully')
  findOne(@Param('id') id: number): Promise<ProductDto> {
    return this.productService.findById(id);
  }

  @Post()
  @ResponseMessage('Create products successfully')
  create(
    @Body()
    input: CreateProductsInput,
  ): Promise<ProductDto[]> {
    const { products } = input;

    const results = products.map(async (product) => {
      return await this.productService.create(product);
    });

    return Promise.all(results);
  }

  @Patch(':id')
  @ResponseMessage('Update product by id successfully')
  update(
    @Param('id') id: number,
    @Body() product: UpdateProductByIdInput,
  ): Promise<ProductDto> {
    return this.productService.update(id, product);
  }

  @Patch()
  @ResponseMessage('Update products successfully')
  updateAll(@Body() input: UpdateProductsInput): Promise<ProductDto[]> {
    const { products } = input;

    const results = products.map(async ({ id, ...product }) => {
      return await this.productService.update(id, product);
    });

    return Promise.all(results);
  }

  @Delete(':id')
  @ResponseMessage('Delete product by id successfully')
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
