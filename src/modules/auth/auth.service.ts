import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user || user.password !== password) {
      throw new ForbiddenException('Invalid email or password');
    }

    // TODO: Implement JWT token generation
    return user;
  }
}
