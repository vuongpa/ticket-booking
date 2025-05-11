import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

import { ConfigurationModule } from './config/config.module';
import { User, UserSchema } from './infrastructure/schemas/user.schema';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { CreateUserCommandHandler } from './application/handlers/create-user.handler';
import { GetUserByIdQueryHandler } from './application/handlers/get-user-by-id.handler';
import { MemberIdGenerator } from './domain/services/member-id.generator';
import { UserGrpcController } from './infrastructure/grpc/user.controller';
import { KafkaService } from './infrastructure/kafka/kafka.service';
import { UserCreatedHandler } from './infrastructure/kafka/user-events.handler';

const CommandHandlers = [CreateUserCommandHandler];
const QueryHandlers = [GetUserByIdQueryHandler];
const EventHandlers = [UserCreatedHandler];

@Module({
  imports: [
    ConfigurationModule,
    CqrsModule,
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'USER_PACKAGE',
        imports: [ConfigurationModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: join(__dirname, 'infrastructure/proto/user.proto'),
            url: `${configService.get('grpc.host')}:${configService.get('grpc.port')}`,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserGrpcController],
  providers: [
    UserRepository,
    MemberIdGenerator,
    KafkaService,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class UsersModule {}
