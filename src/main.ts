import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3200',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`[server]: Server is running at http://localhost:3000`);
}
bootstrap();
