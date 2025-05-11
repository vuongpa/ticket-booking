import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Optional,
} from '@nestjs/common';
import Redis from 'ioredis';
import { RedisModuleOptions } from './redis.module';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(
    @Optional()
    @Inject('REDIS_OPTIONS')
    private options: RedisModuleOptions = {},
  ) {
    this.client = new Redis({
      host: this.options.host || process.env.REDIS_HOST || 'localhost',
      port: this.options.port || Number(process.env.REDIS_PORT) || 6379,
      password: this.options.password || process.env.REDIS_PASSWORD,
      db: this.options.db || Number(process.env.REDIS_DB) || 0,
    });
  }

  async onModuleInit() {
    try {
      await this.client.ping();
      console.log('Redis connection established');
    } catch (error) {
      console.error('Redis connection failed:', error);
      throw error;
    }
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  getClient(): Redis {
    return this.client;
  }

  set(key: string, value: string, ttl?: number): Promise<string> {
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    }
    return this.client.set(key, value);
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  del(key: string): Promise<number> {
    return this.client.del(key);
  }

  keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  hset(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value);
  }

  hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  hdel(key: string, field: string): Promise<number> {
    return this.client.hdel(key, field);
  }

  lpush(key: string, value: string): Promise<number> {
    return this.client.lpush(key, value);
  }

  rpush(key: string, value: string): Promise<number> {
    return this.client.rpush(key, value);
  }

  lpop(key: string): Promise<string | null> {
    return this.client.lpop(key);
  }

  rpop(key: string): Promise<string | null> {
    return this.client.rpop(key);
  }

  lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lrange(key, start, stop);
  }

  incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  // JSON methods
  async setJSON<T>(key: string, value: T, ttl?: number): Promise<string> {
    const serialized = JSON.stringify(value);
    return this.set(key, serialized, ttl);
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Failed to parse JSON from Redis:', error);
      return null;
    }
  }

  async hsetJSON<T>(key: string, field: string, value: T): Promise<number> {
    const serialized = JSON.stringify(value);
    return this.hset(key, field, serialized);
  }

  async hgetJSON<T>(key: string, field: string): Promise<T | null> {
    const value = await this.hget(key, field);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Failed to parse JSON from Redis hash:', error);
      return null;
    }
  }
}
