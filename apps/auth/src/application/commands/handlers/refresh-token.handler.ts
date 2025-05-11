import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '../refresh-token.command';
import { JwtService } from '../../../infrastructure/services/jwt.service';
import { UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../../../infrastructure/services/token.service';
import { UserRepository } from 'apps/auth/src/infrastructure/repositories/user.repository';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<{
    success: boolean;
    message: string;
    accessToken?: string;
    refreshToken?: string;
  }> {
    const { refreshToken } = command;

    // Verify refresh token using TokenService
    const userId = await this.tokenService.verifyRefreshToken(refreshToken);
    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Get user by id
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new tokens
    const newAccessToken = this.jwtService.generateAccessToken(user);
    const newRefreshToken = this.jwtService.generateRefreshToken(user);

    // Update refresh token
    this.tokenService.removeRefreshToken(refreshToken);
    this.tokenService.storeRefreshToken(user.id, user.email, newRefreshToken);

    return {
      success: true,
      message: 'Tokens refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
