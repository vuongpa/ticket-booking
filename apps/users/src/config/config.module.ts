import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { mongoConfig, kafkaConfig, grpcConfig } from './env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig, kafkaConfig, grpcConfig],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string().required(),
        KAFKA_CLIENT_ID: Joi.string().default('users-service'),
        KAFKA_BROKERS: Joi.string().default('localhost:9092'),
        KAFKA_GROUP_ID: Joi.string().default('users-group'),
        GRPC_HOST: Joi.string().default('localhost'),
        GRPC_PORT: Joi.number().default(5000),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('1d'),
        LOG_LEVEL: Joi.string()
          .valid('error', 'warn', 'info', 'debug')
          .default('debug'),
      }),
    }),
  ],
})
export class ConfigurationModule {}
