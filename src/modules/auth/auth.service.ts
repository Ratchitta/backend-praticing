import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { comparePassword } from 'src/common/utils/encrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string, res: Response) {
    const user = await this.userService.findUserByEmail(email);

    if (!user || !comparePassword(password, user.password)) {
      throw new ForbiddenException('Invalid email or password');
    }

    const payload = { id: user.id };
    const token = await this.jwtService.signAsync(payload);

    res?.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production', // Enable this option in production
    });

    // res.status(200).send({ message: 'Login successful' });

    return token;
  }
}
