import { Field, ObjectType, Resolver } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  stock: number;

  @Field()
  createdBy: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  deletedAt: Date | null;
}

@Resolver(() => Product)
export class ProductResolver {}
