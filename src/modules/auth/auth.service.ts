import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtSevice: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user || user.password !== password) {
      throw new ForbiddenException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtSevice.signAsync(payload),
    };
  }
}
