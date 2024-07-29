import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString } from 'class-validator';
import { Public } from 'src/common/decorators/public';

class LoginInput {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(
    @Body()
    input: LoginInput,
  ) {
    const { email, password } = input;
    return this.authService.login(email, password);
  }
}
