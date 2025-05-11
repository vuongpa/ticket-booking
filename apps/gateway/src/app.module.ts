import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    UsersModule,
  ],
})
export class AppModule {}
