import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { CreateUserCommandHandler } from './application/handlers/create-user.handler';
import { GetUserByIdQueryHandler } from './application/handlers/get-user-by-id.handler';
import { GetUserQueryHandler } from './application/handlers/get-user.handler';
import { UpdateUserCommandHandler } from './application/handlers/update-user.handler';
import { ConfigurationModule } from './config/config.module';
import { MemberIdGenerator } from './domain/services/member-id.generator';
import { UserGrpcController } from './infrastructure/grpc/user.controller';
import { KafkaService } from './infrastructure/kafka/kafka.service';
import { UserCreatedHandler } from './infrastructure/kafka/user-events.handler';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { User, UserSchema } from './infrastructure/schemas/user.schema';

const CommandHandlers = [CreateUserCommandHandler, UpdateUserCommandHandler];
const QueryHandlers = [GetUserQueryHandler, GetUserByIdQueryHandler];
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
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
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
