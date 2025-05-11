import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';
import { RegisterCommand } from '../../application/commands/register.command';
import { LoginCommand } from '../../application/commands/login.command';
import { ForgotPasswordCommand } from '../../application/commands/forgot-password.command';
import { ResetPasswordCommand } from '../../application/commands/reset-password.command';
import { VerifyOtpCommand } from '../../application/commands/verify-otp.command';
import { ValidateTokenCommand } from '../../application/commands/validate-token.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token.command';
import {
  RegisterResponse,
  LoginResponse,
  VerifyOtpResponse,
  ValidateTokenResponse,
  RefreshTokenResponse,
  BasicResponse,
} from '@app/protos';

@Controller()
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @GrpcMethod('AuthService', 'Register')
  async register(request: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
  }): Promise<RegisterResponse> {
    return this.commandBus.execute(
      new RegisterCommand(
        request.email,
        request.password,
        request.fullName,
        request.phoneNumber,
      ),
    );
  }

  @GrpcMethod('AuthService', 'Login')
  async login(request: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    return this.commandBus.execute(
      new LoginCommand(request.email, request.password),
    );
  }

  @GrpcMethod('AuthService', 'ForgotPassword')
  async forgotPassword(request: { email: string }): Promise<BasicResponse> {
    return this.commandBus.execute(new ForgotPasswordCommand(request.email));
  }

  @GrpcMethod('AuthService', 'ResetPassword')
  async resetPassword(request: {
    token: string;
    newPassword: string;
  }): Promise<BasicResponse> {
    return this.commandBus.execute(
      new ResetPasswordCommand(request.token, request.newPassword),
    );
  }

  @GrpcMethod('AuthService', 'VerifyOtp')
  async verifyOtp(request: {
    email: string;
    otp: string;
    otpType: string;
  }): Promise<VerifyOtpResponse> {
    return this.commandBus.execute(
      new VerifyOtpCommand(request.email, request.otp, request.otpType),
    );
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(request: {
    token: string;
  }): Promise<ValidateTokenResponse> {
    return this.commandBus.execute(new ValidateTokenCommand(request.token));
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(request: {
    refreshToken: string;
  }): Promise<RefreshTokenResponse> {
    return this.commandBus.execute(
      new RefreshTokenCommand(request.refreshToken),
    );
  }
}
