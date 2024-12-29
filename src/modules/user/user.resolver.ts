import {
  Args,
  Context,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Public } from 'src/common/decorators/public';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Int, { nullable: true })
  age: number;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date | null;
}

@InputType()
class RegisterInput {
  @Field()
  readonly name: string;

  @Field()
  readonly email: string;

  @Field()
  readonly password: string;

  @Field(() => Int, { nullable: true })
  readonly age: number;

  @Field({ nullable: true })
  readonly address: string;

  @Field({ nullable: true })
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

  @Public()
  @Mutation(() => User)
  async register(@Args('input') input: RegisterInput) {
    return this.userService.createUser(input);
  }

  @Public()
  @Query(() => User, { nullable: true })
  async getMyProfile(@CurrentUser() user: User) {
    if (!user) {
      return null;
    }
    return this.userService.findUserById(user.id);
  }
}
