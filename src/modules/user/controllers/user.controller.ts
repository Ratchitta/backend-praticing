import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { TransformInterceptor } from 'src/common/interceptors/response.interceptor';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { UserDto } from '../user.dto';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly age: number;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;
}

@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ResponseMessage('Get all users successfully')
  findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Get user by id successfully')
  findOne(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findById(id);
  }

  @Post()
  @ResponseMessage('Create user successfully')
  create(@Body() user: CreateUserDto): Promise<UserDto> {
    return this.userService.create(user);
  }

  @Delete(':id')
  @ResponseMessage('Delete user by id successfully')
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
