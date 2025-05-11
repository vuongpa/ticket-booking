import {
  AuthServiceClient,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from '@app/protos/generated/auth';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Query,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('api/v1/auth')
export class AuthController implements OnModuleInit {
  private authServiceClient: AuthServiceClient;

  constructor(@Inject('AUTH_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authServiceClient =
      this.client.getService<AuthServiceClient>('AuthService');
  }

  @Get('health-check')
  async healthCheck() {
    return firstValueFrom(this.authServiceClient.healthCheck({}));
  }

  @Post('register')
  async register(@Body() request: RegisterRequest) {
    return firstValueFrom(this.authServiceClient.register(request));
  }

  @Post('login')
  async login(@Body() request: LoginRequest) {
    return firstValueFrom(this.authServiceClient.login(request));
  }

  @Post('forgot-password')
  async forgotPassword(@Body() request: ForgotPasswordRequest) {
    return firstValueFrom(this.authServiceClient.forgotPassword(request));
  }

  @Post('reset-password')
  async resetPassword(@Body() request: ResetPasswordRequest) {
    return firstValueFrom(this.authServiceClient.resetPassword(request));
  }

  @Post('verify-otp')
  async verifyOtp(@Body() request: VerifyOtpRequest) {
    return firstValueFrom(this.authServiceClient.verifyOtp(request));
  }

  @Get('validate-token')
  async validateToken(@Query('token') token: string) {
    return firstValueFrom(this.authServiceClient.validateToken({ token }));
  }

  @Post('refresh-token')
  async refreshToken(@Body() request: RefreshTokenRequest) {
    return firstValueFrom(this.authServiceClient.refreshToken(request));
  }
}
