import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../reset-password.command';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../../../infrastructure/services/token.service';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    command: ResetPasswordCommand,
  ): Promise<{ success: boolean; message: string }> {
    const { token, newPassword } = command;

    // Verify the reset token
    const userId = this.tokenService.verifyPasswordResetToken(token);
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
