import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const port = configService.get('server.port');
  await app.listen(port);
  console.log(`Users service is running on port ${port}`);
}
bootstrap();
