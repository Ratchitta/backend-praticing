import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string, res: Response) {
    const user = await this.userService.findUserByEmail(email);

    if (!user || user.password !== password) {
      throw new ForbiddenException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
    });

    res.status(200).send({ message: 'Login successful' });

    return token;
  }
}
