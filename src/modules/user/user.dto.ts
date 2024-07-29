import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductDto } from '../product/product.dto';

export class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  @Min(0)
  age: number;

  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;

  @Type(() => ProductDto)
  products: ProductDto[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt: Date | null;
}
