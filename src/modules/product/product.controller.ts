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
import { ProductDto } from './product.dto';
import { ProductService } from './product.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDto } from '../user/user.dto';

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
  @IsNumber()
  readonly id: string;

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
  @Type(() => UpdateProductByIdInput)
  readonly products: UpdateProductByIdInput[];
}

@Controller('products')
@UseInterceptors(TransformInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ResponseMessage('Get all products successfully')
  findAll(): Promise<ProductDto[]> {
    return this.productService.findAllProducts();
  }

  @Get(':id')
  @ResponseMessage('Get product by id successfully')
  findOne(@Param('id') id: string): Promise<ProductDto> {
    return this.productService.findProductById(id);
  }

  @Post()
  @ResponseMessage('Create products successfully')
  create(
    @Body()
    input: CreateProductsInput,
    @CurrentUser() user: UserDto,
  ): Promise<ProductDto[]> {
    const { products } = input;

    const results = products.map(async (product) => {
      return await this.productService.createProduct({
        ...product,
        createdBy: user.id,
      });
    });

    return Promise.all(results);
  }

  @Patch(':id')
  @ResponseMessage('Update product by id successfully')
  update(
    @Param('id') id: string,
    @Body() product: UpdateProductByIdInput,
    @CurrentUser() user: UserDto,
  ): Promise<ProductDto> {
    return this.productService.updateProductById(id, {
      ...product,
      createdBy: user.id,
    });
  }

  @Patch()
  @ResponseMessage('Update products successfully')
  updateAll(
    @Body() input: UpdateProductsInput,
    @CurrentUser() user: UserDto,
  ): Promise<ProductDto[]> {
    const { products } = input;

    const results = products.map(async ({ id, ...product }) => {
      return await this.productService.updateProductById(id, {
        ...product,
        createdBy: user.id,
      });
    });

    return Promise.all(results);
  }

  @Delete(':id')
  @ResponseMessage('Delete product by id successfully')
  remove(@Param('id') id: string): Promise<ProductDto> {
    return this.productService.softDeleteProductById(id);
  }
}
