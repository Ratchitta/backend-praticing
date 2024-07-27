import { IsDate, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  deletedAt: Date;
}
