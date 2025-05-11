import { RegisterHandler } from './register.handler';
import { LoginHandler } from './login.handler';
import { ForgotPasswordHandler } from './forgot-password.handler';
import { ResetPasswordHandler } from './reset-password.handler';
import { VerifyOtpHandler } from './verify-otp.handler';
import { ValidateTokenHandler } from './validate-token.handler';
import { RefreshTokenHandler } from './refresh-token.handler';

export const CommandHandlers = [
  RegisterHandler,
  LoginHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler,
  VerifyOtpHandler,
  ValidateTokenHandler,
  RefreshTokenHandler,
];
