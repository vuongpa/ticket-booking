import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/auth.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { CommandHandlers } from './application/commands/handlers';
import { JwtService } from './infrastructure/services/jwt.service';
import { EmailService } from './infrastructure/services/email.service';
import { SmsService } from './infrastructure/services/sms.service';
import { OtpService } from './infrastructure/services/otp.service';
import { TokenService } from './infrastructure/services/token.service';
import jwtConfig from './infrastructure/config/jwt.config';
import { UserServiceModule } from './infrastructure/clients/user-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.accessTokenExpiration'),
        },
      }),
    }),
    CqrsModule,
    UserServiceModule,
  ],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    JwtService,
    EmailService,
    SmsService,
    OtpService,
    TokenService,
  ],
})
export class AuthModule {}
