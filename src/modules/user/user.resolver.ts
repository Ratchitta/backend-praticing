import {
  Resolver,
  Query,
  Mutation,
  Args,
  InputType,
  Field,
  ObjectType,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { ProductDto } from '../product/product.dto';

@ObjectType()
class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  age: number;

  @Field()
  address: string;

  @Field()
  phoneNumber: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date | null;
}

@InputType()
class CreateUserDto {
  @Field()
  readonly name: string;

  @Field()
  readonly email: string;

  @Field()
  readonly password: string;

  @Field()
  readonly age: number;

  @Field()
  readonly address: string;

  @Field()
  readonly phoneNumber: string;
}

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'findAllUsers' })
  async users() {
    return this.userService.findAllUsers();
  }

  @Query(() => User, { name: 'findUserById' })
  async user(@Args('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserDto) {
    return this.userService.createUser(input);
  }
}
