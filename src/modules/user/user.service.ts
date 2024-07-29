import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';

class UserWithoutId {
  readonly name: string;
  readonly email: string;
  readonly age: number;
  readonly address: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserById(id: number): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['products'],
    });
    if (!result) {
      const errorMessage = `User with id ${id} not found`;
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
      relations: ['products'],
    });
  }

  async createUser(user: UserWithoutId): Promise<User> {
    const dateNow = new Date();
    return await this.userRepository.save({
      ...user,
      createdAt: dateNow,
      updatedAt: dateNow,
    });
  }

  async softDeleteUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    await this.userRepository.update(id, {
      ...user,
      deletedAt: new Date(),
    });
  }
}
