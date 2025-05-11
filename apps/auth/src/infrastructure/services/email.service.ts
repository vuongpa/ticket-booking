import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  sendVerificationEmail(email: string, otp: string): Promise<boolean> {
    // In a real application, this would integrate with an actual email service like SendGrid, AWS SES, etc.
    this.logger.log(`Sending verification email to ${email} with OTP: ${otp}`);

    // Simulate sending email
    return Promise.resolve(true);
  }

  sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    this.logger.log(
      `Sending password reset email to ${email} with token: ${token}`,
    );

    // Simulate sending email
    return Promise.resolve(true);
  }
}
