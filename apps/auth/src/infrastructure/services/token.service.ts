import { Injectable } from '@nestjs/common';
import { RedisService } from '@app/redis';

interface TokenRecord {
  userId: string;
  email: string;
  token: string;
  type: 'PASSWORD_RESET' | 'REFRESH_TOKEN';
  expiresAt: Date;
}

@Injectable()
export class TokenService {
  // Redis keys
  private readonly PASSWORD_RESET_PREFIX = 'password_reset:';
  private readonly REFRESH_TOKEN_PREFIX = 'refresh_token:';

  constructor(private readonly redisService: RedisService) {}

  async generatePasswordResetToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Set expiration (1 hour in seconds)
    const expirationSeconds = 60 * 60;
    const expiresAt = new Date(Date.now() + expirationSeconds * 1000);

    // Store token record in Redis
    await this.redisService.setJSON<TokenRecord>(
      `${this.PASSWORD_RESET_PREFIX}${token}`,
      {
        userId,
        email,
        token,
        type: 'PASSWORD_RESET',
        expiresAt,
      },
      expirationSeconds,
    );

    return token;
  }

  async verifyPasswordResetToken(token: string): Promise<string | null> {
    // Find the token record in Redis
    const tokenRecord = await this.redisService.getJSON<TokenRecord>(
      `${this.PASSWORD_RESET_PREFIX}${token}`,
    );

    if (!tokenRecord || new Date(tokenRecord.expiresAt) <= new Date()) {
      return null;
    }

    return tokenRecord.userId;
  }

  async removePasswordResetToken(token: string): Promise<void> {
    await this.redisService.del(`${this.PASSWORD_RESET_PREFIX}${token}`);
  }

  async storeRefreshToken(
    userId: string,
    email: string,
    token: string,
  ): Promise<void> {
    // Set expiration (7 days in seconds)
    const expirationSeconds = 7 * 24 * 60 * 60;
    const expiresAt = new Date(Date.now() + expirationSeconds * 1000);

    // Store token record in Redis
    await this.redisService.setJSON<TokenRecord>(
      `${this.REFRESH_TOKEN_PREFIX}${token}`,
      {
        userId,
        email,
        token,
        type: 'REFRESH_TOKEN',
        expiresAt,
      },
      expirationSeconds,
    );
  }

  async verifyRefreshToken(token: string): Promise<string | null> {
    // Find the token record in Redis
    const tokenRecord = await this.redisService.getJSON<TokenRecord>(
      `${this.REFRESH_TOKEN_PREFIX}${token}`,
    );

    if (!tokenRecord || new Date(tokenRecord.expiresAt) <= new Date()) {
      return null;
    }

    return tokenRecord.userId;
  }

  async removeRefreshToken(token: string): Promise<void> {
    await this.redisService.del(`${this.REFRESH_TOKEN_PREFIX}${token}`);
  }
}
