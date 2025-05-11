import { Injectable } from '@nestjs/common';
import { OtpType } from '../../domain/models/user.model';

interface OtpRecord {
  userId: string;
  email: string;
  otp: string;
  type: OtpType;
  expiresAt: Date;
}

@Injectable()
export class OtpService {
  // In-memory storage for OTPs
  // In production, use Redis or another suitable database
  private otpRecords: OtpRecord[] = [];

  generateOtp(userId: string, email: string, type: OtpType): string {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store OTP record
    this.otpRecords.push({
      userId,
      email,
      otp,
      type,
      expiresAt,
    });

    // Remove expired OTPs
    this.cleanupExpiredOtps();

    return otp;
  }

  verifyOtp(email: string, otp: string, type: OtpType): boolean {
    // Find the OTP record
    const otpIndex = this.otpRecords.findIndex(
      (record) =>
        record.email === email &&
        record.otp === otp &&
        record.type === type &&
        record.expiresAt > new Date(),
    );

    if (otpIndex === -1) {
      return false;
    }

    // Remove the OTP record (one-time use)
    this.otpRecords.splice(otpIndex, 1);

    return true;
  }

  private cleanupExpiredOtps(): void {
    const now = new Date();
    this.otpRecords = this.otpRecords.filter(
      (record) => record.expiresAt > now,
    );
  }
}
