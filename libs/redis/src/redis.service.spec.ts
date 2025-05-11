import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

// Mock ioredis
jest.mock('ioredis', () => {
  const Redis = jest.fn();
  Redis.prototype.ping = jest.fn().mockResolvedValue('PONG');
  Redis.prototype.set = jest.fn().mockResolvedValue('OK');
  Redis.prototype.get = jest.fn().mockImplementation((key) => {
    if (key === 'json-key')
      return Promise.resolve(JSON.stringify({ test: 'data' }));
    if (key === 'invalid-json') return Promise.resolve('{invalid]');
    return Promise.resolve('value');
  });
  Redis.prototype.del = jest.fn().mockResolvedValue(1);
  Redis.prototype.disconnect = jest.fn();
  Redis.prototype.hset = jest.fn().mockResolvedValue(1);
  Redis.prototype.hget = jest.fn().mockImplementation((key, field) => {
    if (field === 'json-field')
      return Promise.resolve(JSON.stringify({ test: 'data' }));
    if (field === 'invalid-json') return Promise.resolve('{invalid]');
    return Promise.resolve('value');
  });
  return Redis;
});

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Basic operations', () => {
    it('should set a value', async () => {
      await service.set('key', 'value');
      expect(service.getClient().set).toHaveBeenCalledWith('key', 'value');
    });

    it('should set a value with TTL', async () => {
      await service.set('key', 'value', 60);
      expect(service.getClient().set).toHaveBeenCalledWith(
        'key',
        'value',
        'EX',
        60,
      );
    });

    it('should get a value', async () => {
      const result = await service.get('key');
      expect(service.getClient().get).toHaveBeenCalledWith('key');
      expect(result).toBe('value');
    });

    it('should delete a key', async () => {
      const result = await service.del('key');
      expect(service.getClient().del).toHaveBeenCalledWith('key');
      expect(result).toBe(1);
    });
  });

  describe('JSON operations', () => {
    it('should set JSON data', async () => {
      const data = { name: 'test', value: 123 };
      await service.setJSON('json-key', data);
      expect(service.getClient().set).toHaveBeenCalledWith(
        'json-key',
        JSON.stringify(data),
      );
    });

    it('should get and parse JSON data', async () => {
      const result = await service.getJSON('json-key');
      expect(service.getClient().get).toHaveBeenCalledWith('json-key');
      expect(result).toEqual({ test: 'data' });
    });

    it('should return null for invalid JSON data', async () => {
      const result = await service.getJSON('invalid-json');
      expect(result).toBeNull();
    });

    it('should set JSON data in hash field', async () => {
      const data = { name: 'test', value: 123 };
      await service.hsetJSON('hash-key', 'field', data);
      expect(service.getClient().hset).toHaveBeenCalledWith(
        'hash-key',
        'field',
        JSON.stringify(data),
      );
    });

    it('should get and parse JSON data from hash field', async () => {
      const result = await service.hgetJSON('hash-key', 'json-field');
      expect(service.getClient().hget).toHaveBeenCalledWith(
        'hash-key',
        'json-field',
      );
      expect(result).toEqual({ test: 'data' });
    });

    it('should return null for invalid JSON data in hash field', async () => {
      const result = await service.hgetJSON('hash-key', 'invalid-json');
      expect(result).toBeNull();
    });
  });
});
