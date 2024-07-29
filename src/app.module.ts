import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelloModule } from './modules/hello/hello.module';
import { UserModule } from './modules/user/user.module';

import { User } from './common/entities/user.entity';
import { Product } from './common/entities/product.entity';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';

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
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
