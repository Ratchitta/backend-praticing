import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNumber, IsString, Min } from 'class-validator';
import { IsNull, Repository } from 'typeorm';
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

  async findById(id: number): Promise<Product> {
    const result = await this.productRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!result) {
      const errorMessage = `Product with id ${id} not found`;
      console.error(`[ProductService] findOne: ${errorMessage}`);
      throw new NotFoundException(errorMessage);
    }
    return result;
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async create(product: ProductWithoutId): Promise<Product> {
    const dateNow = new Date();
    return await this.productRepository.save({
      ...product,
      createdAt: dateNow,
      updatedAt: dateNow,
    });
  }

  async update(id: number, product: ProductWithoutId): Promise<Product> {
    await this.productRepository.update(id, product);
    return await this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(Number(id));
    await this.productRepository.update(id, {
      ...product,
      deletedAt: new Date(),
    });
  }
}
