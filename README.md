# Backend with NestJS

## Table of Contents

- [Backend with NestJS](#backend-with-nestjs)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Tutorial from ChatGPT](#tutorial-from-chatgpt)
    - [Step 1: Verify Docker Installation](#step-1-verify-docker-installation)
    - [Step 2: Create a NestJS Project](#step-2-create-a-nestjs-project)
    - [Step 3: Install Dependencies](#step-3-install-dependencies)
    - [Step 4: Create a Docker Compose File for PostgreSQL](#step-4-create-a-docker-compose-file-for-postgresql)
    - [Step 5: Run Docker Compose](#step-5-run-docker-compose)
    - [Step 6: Configure TypeORM in NestJS](#step-6-configure-typeorm-in-nestjs)
    - [Step 7: Create an Entity](#step-7-create-an-entity)
    - [Step 8: Create Service and Controller](#step-8-create-service-and-controller)
    - [Step 9: Test Your Project](#step-9-test-your-project)
  - [Exercise from ChatGPT](#exercise-from-chatgpt)
    - [Exercise 1: Extend the User Entity](#exercise-1-extend-the-user-entity)
    - [Exercise 2: Add a Product Entity](#exercise-2-add-a-product-entity)
    - [Exercise 3: Implement Relations Between Entities](#exercise-3-implement-relations-between-entities)
    - [Exercise 4: Add Validation and Error Handling](#exercise-4-add-validation-and-error-handling)
    - [Exercise 5: Implement Authentication](#exercise-5-implement-authentication)

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Tutorial from ChatGPT

### Step 1: Verify Docker Installation

Open your terminal (Command Prompt, PowerShell, or any terminal emulator).
Run the following command to ensure Docker is installed correctly:

```bash
docker --version
You should see the Docker version printed out.
```

### Step 2: Create a NestJS Project

1. Open your terminal.
2. Run the following command to create a new NestJS project:

```bash
nest new my-nestjs-project
```

3. Follow the prompts to set up the project (you can choose `npm` or `yarn` as your package manager).

### Step 3: Install Dependencies

1. Navigate to the project directory:

```bash
cd my-nestjs-project
```

2. Install TypeORM and PostgreSQL driver:

```bash
npm install @nestjs/typeorm typeorm pg
```

### Step 4: Create a Docker Compose File for PostgreSQL

In the root directory of your NestJS project, create a file named `docker-compose.yml`.
Add the following content to the file:

```yaml
version: '3.1'

services:
  db:
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase
    ports:
      - '5432:5432'
```

### Step 5: Run Docker Compose

In your terminal, make sure you are in the root directory of your project where the `docker-compose.yml` file is located.
Run the following command to start the PostgreSQL container:

```bash
docker-compose up -d
```

This command will download the PostgreSQL image, create a container, and start it in detached mode.

### Step 6: Configure TypeORM in NestJS

1. Open `src/app.module.ts` in your NestJS project.
2. Modify it to include TypeORM configuration for PostgreSQL:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mydatabase',
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

### Step 7: Create an Entity

1. Create a new file named `user.entity.ts` in the src directory.

2. Add the following content:

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
```

3. Update src/app.module.ts to include the User entity:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mydatabase',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class AppModule {}
```

### Step 8: Create Service and Controller

1. Create a new file named `user.service.ts` in the src directory.

2. Add the following content:

```typescript
Copy code
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
```

3. Create a new file named `user.controller.ts` in the src directory.

4. Add the following content:

```typescript
Copy code
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
```

5. Update src/app.module.ts to include the Service and Controller:

```typescript
Copy code
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mydatabase',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
```

### Step 9: Test Your Project

Run your NestJS project:

```
npm run start
```

You can test your API using tools like Postman or curl

## Exercise from ChatGPT

### Exercise 1: Extend the User Entity

Problem: Add additional fields to the `User` entity such as `age`, `address`, and `phoneNumber`. Update the service and controller to handle these new fields.

### Exercise 2: Add a Product Entity

Problem: Create a new entity called `Product` with fields like `name`, `description`, `price`, and `stock`. Implement CRUD operations for this new entity.

### Exercise 3: Implement Relations Between Entities

Problem: Create a one-to-many relationship between `User` and `Product` where each user can have multiple products.

### Exercise 4: Add Validation and Error Handling

Problem: Add validation to the `User` and `Product` entities using class-validator and implement proper error handling in the controllers.

### Exercise 5: Implement Authentication

Problem: Implement JWT-based authentication in your NestJS project.
