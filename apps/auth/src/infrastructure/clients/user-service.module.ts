import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UserServiceClient } from './user-service.client';
import userServiceConfig from '../config/user-service.config';

@Module({
  imports: [
    ConfigModule.forFeature(userServiceConfig),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: join(
              process.cwd(),
              'apps/auth/src/infrastructure/proto/user.proto',
            ),
            url: configService.get('userService.url'),
          },
        }),
      },
    ]),
  ],
  providers: [UserServiceClient],
  exports: [UserServiceClient],
})
export class UserServiceModule {}
