import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
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

  async create(product: Product): Promise<Product> {
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
