# Redis Module

A shared Redis module for microservices utilizing ioredis.

## Installation

This module is already part of the monorepo, so no installation is required.

## Usage

### In a NestJS microservice

1. Import the RedisModule in your module:

```typescript
import { Module } from '@nestjs/common';
import { RedisModule } from '@app/redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    RedisModule.register({
      host: 'localhost', // optional, defaults to env.REDIS_HOST or 'localhost'
      port: 6379,        // optional, defaults to env.REDIS_PORT or 6379
      password: 'pass',  // optional, defaults to env.REDIS_PASSWORD
      db: 0,             // optional, defaults to env.REDIS_DB or 0
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

2. Inject and use the RedisService in your service:

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@app/redis';

interface UserData {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  async cacheData(key: string, data: string): Promise<void> {
    await this.redisService.set(key, data, 3600); // Store with TTL of 1 hour
  }

  async getData(key: string): Promise<string | null> {
    return this.redisService.get(key);
  }
  
  // Using JSON methods
  async cacheUser(userId: string, userData: UserData): Promise<void> {
    await this.redisService.setJSON<UserData>(`user:${userId}`, userData, 3600);
  }
  
  async getUser(userId: string): Promise<UserData | null> {
    return this.redisService.getJSON<UserData>(`user:${userId}`);
  }
}
```

### Using environment variables

You can also configure the Redis connection using environment variables:

```
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=yourpassword
REDIS_DB=0
```

## Available Methods

The RedisService provides wrappers for common Redis operations:

- `set(key, value, ttl?)`: Set a key with optional TTL in seconds
- `get(key)`: Get a value by key
- `del(key)`: Delete a key
- `keys(pattern)`: Get keys matching a pattern
- `exists(key)`: Check if a key exists
- `expire(key, seconds)`: Set expiration on a key
- `ttl(key)`: Get time-to-live for a key

### JSON Operations
- `setJSON<T>(key, value, ttl?)`: Store JSON data with optional TTL
- `getJSON<T>(key)`: Retrieve and parse JSON data
- `hsetJSON<T>(key, field, value)`: Store JSON in a hash field
- `hgetJSON<T>(key, field)`: Retrieve and parse JSON from a hash field

### Hash Operations
- `hset(key, field, value)`: Set hash field
- `hget(key, field)`: Get hash field
- `hgetall(key)`: Get all hash fields
- `hdel(key, field)`: Delete hash field

### List Operations
- `lpush(key, value)`: Push to start of list
- `rpush(key, value)`: Push to end of list
- `lpop(key)`: Pop from start of list
- `rpop(key)`: Pop from end of list
- `lrange(key, start, stop)`: Get range from list

### Other Operations
- `incr(key)`: Increment value
- `decr(key)`: Decrement value

## Advanced Usage

For direct access to the Redis client:

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@app/redis';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
  private readonly redis: Redis;
  
  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  async complexOperation() {
    // Use the native client for advanced operations
    const pipeline = this.redis.pipeline();
    pipeline.set('key1', 'value1');
    pipeline.set('key2', 'value2');
    await pipeline.exec();
  }
}
``` 