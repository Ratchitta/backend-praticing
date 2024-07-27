import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(0)
  age: number;

  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;

  @IsOptional()
  @IsString()
  deletedAt: Date | null;
}
