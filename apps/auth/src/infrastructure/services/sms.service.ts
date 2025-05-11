import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  sendVerificationSms(phoneNumber: string, otp: string): Promise<boolean> {
    // In a real application, this would integrate with an actual SMS service like Twilio, AWS SNS, etc.
    this.logger.log(
      `Sending verification SMS to ${phoneNumber} with OTP: ${otp}`,
    );

    // Simulate sending SMS
    return Promise.resolve(true);
  }
}
