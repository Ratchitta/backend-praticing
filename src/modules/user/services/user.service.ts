import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

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

  async findById(id: number): Promise<User> {
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

  findAll(): Promise<User[]> {
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

  async create(user: UserWithoutId): Promise<User> {
    const dateNow = new Date();
    return await this.userRepository.save({
      ...user,
      createdAt: dateNow,
      updatedAt: dateNow,
    });
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.update(id, {
      ...user,
      deletedAt: new Date(),
    });
  }
}
