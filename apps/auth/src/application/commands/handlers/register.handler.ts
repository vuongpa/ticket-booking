import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../register.command';
import { ConflictException } from '@nestjs/common';
import { OtpType, User } from 'apps/auth/src/domain/models/user.model';
import { UserRepository } from 'apps/auth/src/infrastructure/repositories/user.repository';
import { EmailService } from 'apps/auth/src/infrastructure/services/email.service';
import { OtpService } from 'apps/auth/src/infrastructure/services/otp.service';
import { SmsService } from 'apps/auth/src/infrastructure/services/sms.service';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly otpService: OtpService,
  ) {}

  async execute(
    command: RegisterCommand,
  ): Promise<{ userId: string; success: boolean; message: string }> {
    const { email, password, fullName, phoneNumber } = command;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user with a temporary password (will be set properly after)
    const user = new User({
      email,
      password: '', // Temporary placeholder
      fullName,
      phoneNumber,
    });

    // Save user - now this will use the UserServiceClient through the repository
    const savedUser = await this.userRepository.create(user);

    // Set the password using the repository method
    await this.userRepository.setPassword(savedUser.id, password);

    // Generate verification codes
    const emailOtp = this.otpService.generateOtp(
      savedUser.id,
      email,
      OtpType.EMAIL_VERIFICATION,
    );

    // Send verification email
    await this.emailService.sendVerificationEmail(email, emailOtp);

    // If phone number is provided, send verification SMS
    if (phoneNumber) {
      const phoneOtp = this.otpService.generateOtp(
        savedUser.id,
        email,
        OtpType.PHONE_VERIFICATION,
      );
      await this.smsService.sendVerificationSms(phoneNumber, phoneOtp);
    }

    return {
      userId: savedUser.id,
      success: true,
      message: 'User registered successfully. Please verify your email.',
    };
  }
}
