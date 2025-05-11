import { Injectable } from '@nestjs/common';

interface TokenRecord {
  userId: string;
  email: string;
  token: string;
  type: 'PASSWORD_RESET' | 'REFRESH_TOKEN';
  expiresAt: Date;
}

@Injectable()
export class TokenService {
  // In-memory storage for tokens
  // In production, use Redis or another suitable database
  private tokenRecords: TokenRecord[] = [];

  generatePasswordResetToken(userId: string, email: string): string {
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Set expiration (1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Remove any existing password reset tokens for this user
    this.tokenRecords = this.tokenRecords.filter(
      (record) =>
        !(record.userId === userId && record.type === 'PASSWORD_RESET'),
    );

    // Store token record
    this.tokenRecords.push({
      userId,
      email,
      token,
      type: 'PASSWORD_RESET',
      expiresAt,
    });

    // Remove expired tokens
    this.cleanupExpiredTokens();

    return token;
  }

  verifyPasswordResetToken(token: string): string | null {
    // Find the token record
    const tokenRecord = this.tokenRecords.find(
      (record) =>
        record.token === token &&
        record.type === 'PASSWORD_RESET' &&
        record.expiresAt > new Date(),
    );

    if (!tokenRecord) {
      return null;
    }

    return tokenRecord.userId;
  }

  removePasswordResetToken(token: string): void {
    this.tokenRecords = this.tokenRecords.filter(
      (record) => !(record.token === token && record.type === 'PASSWORD_RESET'),
    );
  }

  storeRefreshToken(userId: string, email: string, token: string): void {
    // Set expiration (7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Remove any existing refresh tokens for this user
    this.tokenRecords = this.tokenRecords.filter(
      (record) =>
        !(record.userId === userId && record.type === 'REFRESH_TOKEN'),
    );

    // Store token record
    this.tokenRecords.push({
      userId,
      email,
      token,
      type: 'REFRESH_TOKEN',
      expiresAt,
    });

    // Remove expired tokens
    this.cleanupExpiredTokens();
  }

  verifyRefreshToken(token: string): string | null {
    // Find the token record
    const tokenRecord = this.tokenRecords.find(
      (record) =>
        record.token === token &&
        record.type === 'REFRESH_TOKEN' &&
        record.expiresAt > new Date(),
    );

    if (!tokenRecord) {
      return null;
    }

    return tokenRecord.userId;
  }

  removeRefreshToken(token: string): void {
    this.tokenRecords = this.tokenRecords.filter(
      (record) => !(record.token === token && record.type === 'REFRESH_TOKEN'),
    );
  }

  private cleanupExpiredTokens(): void {
    const now = new Date();
    this.tokenRecords = this.tokenRecords.filter(
      (record) => record.expiresAt > now,
    );
  }
}
