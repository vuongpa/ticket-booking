import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../reset-password.command';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../../../infrastructure/services/token.service';
import { UserRepository } from 'apps/auth/src/infrastructure/repositories/user.repository';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    command: ResetPasswordCommand,
  ): Promise<{ success: boolean; message: string }> {
    const { token, newPassword } = command;

    // Verify the reset token
    const userId = await this.tokenService.verifyPasswordResetToken(token);
    if (!userId) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Get the user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update password
    await this.userRepository.setPassword(userId, newPassword);

    // Remove the used token
    this.tokenService.removePasswordResetToken(token);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }
}
