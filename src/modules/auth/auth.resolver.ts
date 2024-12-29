import {
  Args,
  Context,
  Field,
  Mutation,
  ObjectType,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public';

@ObjectType()
class AuthResponse {
  @Field()
  message: string;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: { res: Response },
  ): Promise<AuthResponse> {
    const response = context.res;
    const token = await this.authService.login(email, password, response);
    if (!token) {
      throw new Error('Invalid email or password');
    }

    return { message: 'Login successful' };
  }
}
