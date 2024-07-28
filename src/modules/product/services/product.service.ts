import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNumber, IsString, Min } from 'class-validator';
import { IsNull, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { UserService } from 'src/modules/user/services/user.service';

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

  @IsNumber()
  readonly userId: number;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private userService: UserService,
  ) {}

  async findById(id: number): Promise<Product> {
    const result = await this.productRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user'],
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
      relations: ['user'],
    });
  }

  async create(product: ProductWithoutId): Promise<Product> {
    const { userId, ...restProps } = product;
    const user = await this.userService.findById(userId);

    const dateNow = new Date();
    return await this.productRepository.save({
      ...restProps,
      user,
      createdAt: dateNow,
      updatedAt: dateNow,
    });
  }

  async update(id: number, product: ProductWithoutId): Promise<Product> {
    const { userId, ...remainingProps } = product;

    const oldProduct = await this.findById(id);
    let newProduct: Product = { ...oldProduct, ...remainingProps };

    if (oldProduct.deletedAt) {
      const errorMessage = `Product with id ${id} not found`;
      console.error(`[ProductService] update: ${errorMessage}`);
      throw new NotFoundException(errorMessage);
    }

    if (oldProduct.user.id !== userId) {
      const user = await this.userService.findById(userId);

      newProduct = {
        ...newProduct,
        user,
      };
    }

    await this.productRepository.update(id, {
      ...newProduct,
      updatedAt: new Date(),
    });

    return await this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(Number(id));

    if (product.deletedAt) {
      const errorMessage = `Product with id ${id} not found`;
      console.error(`[ProductService] remove: ${errorMessage}`);
      throw new NotFoundException(errorMessage);
    }

    await this.productRepository.update(id, {
      ...product,
      deletedAt: new Date(),
    });
  }
}
