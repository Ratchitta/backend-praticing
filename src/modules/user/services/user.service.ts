import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!result) {
      throw new NotFoundException(
        `[UserService] findOne: User with id ${id} not found`,
      );
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
    });
  }

  async create(user: User): Promise<User> {
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
