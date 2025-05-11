import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const configService = app.get(ConfigService);
  const port = configService.get('server.port');
  await app.listen(port);
  console.log(`Users service is running on port ${port}`);
}
bootstrap();
