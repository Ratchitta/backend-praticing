import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNumber, IsString, Min } from 'class-validator';
import { IsNull, Repository } from 'typeorm';
import { Product } from 'src/common/entities/product.entity';
import { UserService } from '../user/user.service';

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

  @IsString()
  readonly createdBy: string;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private userService: UserService,
  ) {}

  async findProductById(id: string): Promise<Product> {
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

  findAllProducts(): Promise<Product[]> {
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

  async createProduct(product: ProductWithoutId): Promise<Product> {
    const { createdBy, ...restProps } = product;
    const user = await this.userService.findUserById(createdBy);

    const dateNow = new Date();
    return await this.productRepository.save({
      ...restProps,
      createdBy: user.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });
  }

  async updateProductById(
    id: string,
    product: ProductWithoutId,
  ): Promise<Product> {
    const { createdBy, ...remainingProps } = product;

    const oldProduct = await this.findProductById(id);
    let newProduct: Product = { ...oldProduct, ...remainingProps };

    if (oldProduct.deletedAt) {
      const errorMessage = `Product with id ${id} not found`;
      console.error(`[ProductService] update: ${errorMessage}`);
      throw new NotFoundException(errorMessage);
    }

    if (oldProduct.createdBy !== createdBy) {
      const user = await this.userService.findUserById(createdBy);

      newProduct = {
        ...newProduct,
        createdBy: user.id,
      };
    }

    await this.productRepository.update(id, {
      ...newProduct,
      updatedAt: new Date(),
    });

    return await this.findProductById(id);
  }

  async softDeleteProductById(id: string): Promise<Product> {
    const product = await this.findProductById(id);

    if (product.deletedAt) {
      const errorMessage = `Product with id ${id} not found`;
      console.error(`[ProductService] remove: ${errorMessage}`);
      throw new NotFoundException(errorMessage);
    }

    await this.productRepository.update(id, {
      ...product,
      deletedAt: new Date(),
    });

    return await this.findProductById(id);
  }
}
