import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { hashPassword } from 'src/common/utils/encrypt';

export enum RegisterErrorMessages {
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
}

class UserWithoutId {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly age: number;
  readonly address: string;
  readonly phoneNumber: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserById(id: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!result) {
      const errorMessage = `User with id ${id} not found`;
      console.error(`[UserService] findOne: ${errorMessage}`);
      throw new NotFoundException(errorMessage);
    }
    return result;
  }

  async findUserByEmail(email: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
    if (!result) {
      const errorMessage = `User with email ${email} not found`;
      console.error(`[UserService] findOne: ${errorMessage}`);
      throw new NotFoundException(errorMessage);
    }

    return result;
  }

  findAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: {
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async createUser(user: UserWithoutId): Promise<User> {
    const dateNow = new Date();

    if (user.password.length < 8) {
      const errorMessage = "Password can't be less than 8 characters";
      console.error(`[UserService] createUser: ${errorMessage}`);
      throw new BadRequestException(RegisterErrorMessages.WEAK_PASSWORD);
    }

    const userWithSameEmail = await this.userRepository.findOne({
      where: { email: user.email, deletedAt: IsNull() },
    });
    if (userWithSameEmail) {
      const errorMessage = `Email ${user.email} already exists`;
      console.error(`[UserService] createUser: ${errorMessage}`);
      throw new BadRequestException(RegisterErrorMessages.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await hashPassword(user.password);

    return await this.userRepository.save({
      ...user,
      password: hashedPassword,
      createdAt: dateNow,
      updatedAt: dateNow,
    });
  }

  async softDeleteUser(id: string): Promise<void> {
    const user = await this.findUserById(id);
    await this.userRepository.update(id, {
      ...user,
      deletedAt: new Date(),
    });
  }
}
