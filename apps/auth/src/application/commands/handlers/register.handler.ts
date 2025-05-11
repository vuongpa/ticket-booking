import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../register.command';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/models/user.model';
import { ConflictException } from '@nestjs/common';
import { EmailService } from '../../../infrastructure/services/email.service';
import { SmsService } from '../../../infrastructure/services/sms.service';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { OtpService } from '../../../infrastructure/services/otp.service';
import { OtpType } from '../../../domain/models/user.model';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
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
    await (this.userRepository as UserRepository).setPassword(
      savedUser.id,
      password,
    );

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
