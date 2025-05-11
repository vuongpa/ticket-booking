import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../login.command';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../../../infrastructure/services/jwt.service';
import { TokenService } from '../../../infrastructure/services/token.service';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginCommand): Promise<{
    success: boolean;
    message: string;
    accessToken?: string;
    refreshToken?: string;
    userInfo?: any;
  }> {
    const { email, password } = command;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Validate password using repository's verifyPassword method
    const isPasswordValid = await (
      this.userRepository as UserRepository
    ).verifyPassword(user.id, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return {
        success: false,
        message: 'Please verify your email before logging in',
      };
    }

    // Generate tokens
    const accessToken = this.jwtService.generateAccessToken(user);
    const refreshToken = this.jwtService.generateRefreshToken(user);

    // Store refresh token
    this.tokenService.storeRefreshToken(user.id, user.email, refreshToken);

    return {
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      userInfo: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
      },
    };
  }
}
