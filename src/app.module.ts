import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelloModule } from './modules/hello/hello.module';
import { UserModule } from './modules/user/user.module';

import { User } from './modules/user/entities/user.entity';
import { Product } from './modules/product/entities/product.entity';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mydatabase',
      entities: [User, Product],
      synchronize: true,
    }),
    HelloModule,
    UserModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
