import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyOtpCommand } from '../verify-otp.command';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OtpService } from '../../../infrastructure/services/otp.service';
import { TokenService } from '../../../infrastructure/services/token.service';
import { OtpType } from '../../../domain/models/user.model';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler implements ICommandHandler<VerifyOtpCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: VerifyOtpCommand): Promise<{
    success: boolean;
    message: string;
    token?: string;
  }> {
    const { email, otp, otpType } = command;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate OTP type
    let type: OtpType;
    try {
      type = otpType as OtpType;
    } catch {
      throw new BadRequestException('Invalid OTP type');
    }

    // Verify OTP using OtpService
    const isValid = this.otpService.verifyOtp(email, otp, type);

    if (!isValid) {
      return {
        success: false,
        message: 'Invalid or expired OTP',
      };
    }

    // Handle verification based on OTP type
    if (type === OtpType.EMAIL_VERIFICATION) {
      // Mark email as verified
      user.emailVerified = true;
      await this.userRepository.update(user);

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } else if (type === OtpType.PHONE_VERIFICATION) {
      // Mark phone as verified
      user.phoneVerified = true;
      await this.userRepository.update(user);

      return {
        success: true,
        message: 'Phone verified successfully',
      };
    } else if (type === OtpType.PASSWORD_RESET) {
      // Generate password reset token
      const resetToken = this.tokenService.generatePasswordResetToken(
        user.id,
        email,
      );

      return {
        success: true,
        message: 'OTP verified. You can now reset your password',
        token: resetToken,
      };
    }

    return {
      success: false,
      message: 'Unknown OTP type',
    };
  }
}
