import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Int)
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

  @Field(() => Int)
  readonly age: number;

  @Field()
  readonly address: string;

  @Field()
  readonly phoneNumber: string;
}

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Query(() => User)
  async findUserById(@Args('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserDto) {
    return this.userService.createUser(input);
  }
}
