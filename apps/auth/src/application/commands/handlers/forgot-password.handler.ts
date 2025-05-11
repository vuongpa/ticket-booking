import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForgotPasswordCommand } from '../forgot-password.command';
import { NotFoundException } from '@nestjs/common';
import { EmailService } from '../../../infrastructure/services/email.service';
import { TokenService } from '../../../infrastructure/services/token.service';
import { UserRepository } from 'apps/auth/src/infrastructure/repositories/user.repository';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    command: ForgotPasswordCommand,
  ): Promise<{ success: boolean; message: string }> {
    const { email } = command;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    // Generate password reset token using TokenService
    const resetToken = await this.tokenService.generatePasswordResetToken(
      user.id,
      email,
    );

    // Send password reset email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return {
      success: true,
      message: 'Password reset link has been sent to your email',
    };
  }
}
