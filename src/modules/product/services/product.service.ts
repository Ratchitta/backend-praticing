import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNumber, IsString, Min } from 'class-validator';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

class ProductWithoutId {
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

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const result = await this.productRepository.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(
        `[ProductService] findOne: Product with id ${id} not found`,
      );
    }
    return result;
  }

  async create(product: ProductWithoutId): Promise<Product> {
    return await this.productRepository.save(product);
  }

  async update(id: number, product: ProductWithoutId): Promise<Product> {
    await this.productRepository.update(id, product);
    return await this.productRepository.findOne({
      where: { id },
    });
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
