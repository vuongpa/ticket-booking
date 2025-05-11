import { registerAs } from '@nestjs/config';

export const mongoConfig = registerAs('mongo', () => ({
  uri:
    process.env.MONGODB_URI ||
    'mongodb://localhost:27018/users?authSource=admin',
}));

export const kafkaConfig = registerAs('kafka', () => ({
  clientId: process.env.KAFKA_CLIENT_ID || 'users-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  groupId: process.env.KAFKA_GROUP_ID || 'users-group',
}));

export const grpcConfig = registerAs('grpc', () => ({
  host: process.env.GRPC_HOST || 'localhost',
  port: parseInt(process.env.GRPC_PORT || '50051', 10),
}));
