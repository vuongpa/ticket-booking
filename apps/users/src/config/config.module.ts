import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mongoConfig, kafkaConfig, grpcConfig } from './env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig, kafkaConfig, grpcConfig],
    }),
  ],
})
export class ConfigurationModule {}
