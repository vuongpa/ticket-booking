import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  // const app = await NestFactory.create(AuthModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: join(
          process.cwd(),
          'apps/auth/src/infrastructure/proto/auth.proto',
        ),
        url: `0.0.0.0:${process.env.PORT || 50052}`,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
