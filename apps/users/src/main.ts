import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(
          process.cwd(),
          'apps/users/src/infrastructure/proto/user.proto',
        ),
        url: `0.0.0.0:${process.env.PORT || 50051}`,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
