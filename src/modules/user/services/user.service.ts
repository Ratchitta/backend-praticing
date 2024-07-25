import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const result = await this.userRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(
        `[UserService] findOne: User with id ${id} not found`,
      );
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
