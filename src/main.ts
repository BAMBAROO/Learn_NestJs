import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // hanya properti yang telah didefinisikan dalam DTO (Data Transfer Object) yang akan diterima dari data masukan.
    }),
  );
  await app.listen(5000);
}

bootstrap();
