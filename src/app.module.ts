import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelloModule } from './modules/hello/hello.module';
import { UserModule } from './modules/user/user.module';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JsonWebTokenError } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { join } from 'node:path';
import { Product } from './common/entities/product.entity';
import { User } from './common/entities/user.entity';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';

const apolloDriverConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  context: async ({ req, connection, res, ...rest }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    } else {
      // check from req
      const token = req?.cookies?.token;
      if (token && token !== 'null') {
        try {
          // validate user in client
          const currentUser = verify(token, process.env.JWT_SECRET);
          // add user to request
          return {
            req: {
              ...req,
              headers: req.headers,
              user: currentUser,
            },
            ...rest,
          };
        } catch (err: string | any) {
          throw new JsonWebTokenError(err);
        }
      }
      return { req, res, ...rest };
    }
  },
  playground: true,
  introspection: true,
};

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
    GraphQLModule.forRoot(apolloDriverConfig),
    HelloModule,
    UserModule,
    ProductModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
