import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ClientsModule.registerAsync([
      {
        name: 'USERS_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: join(
              __dirname,
              '../../../apps/users/src/infrastructure/proto/user.proto',
            ),
            url: `${configService.get('USERS_SERVICE_HOST', 'localhost')}:${configService.get('USERS_SERVICE_PORT', 50051)}`,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
