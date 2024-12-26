import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.resolver';

@ObjectType()
export class Product {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field()
  createdBy: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date | null;
}

@InputType()
export class ProductWithoutId {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  stock: number;
}

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [Product])
  async findAllProducts(): Promise<Product[]> {
    return this.productService.findAllProducts();
  }

  @Query(() => Product)
  async findProductById(id: string): Promise<Product> {
    return this.productService.findProductById(id);
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('product') product: ProductWithoutId,
    @CurrentUser() user: UserDto,
  ): Promise<Product> {
    return this.productService.createProduct({
      ...product,
      createdBy: user.id,
    });
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id') id: string,
    @Args('product') product: ProductWithoutId,
    @CurrentUser() user: UserDto,
  ): Promise<Product> {
    return this.productService.updateProductById(id, {
      ...product,
      createdBy: user.id,
    });
  }

  @Mutation(() => Product)
  async deleteProduct(@Args('id') id: string): Promise<Product> {
    return this.productService.softDeleteProductById(id);
  }

  @ResolveField(() => User)
  async owner(@Parent() product: Product): Promise<User> {
    return this.userService.findUserById(product.createdBy);
  }
}
