import {
  Controller,
  Get,
  Put,
  Body,
  Inject,
  UseGuards,
  Req,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '@app/shared';
import { firstValueFrom } from 'rxjs';
import { UserServiceClient } from '@app/protos';

@Controller('api/v1/users')
export class UsersController implements OnModuleInit {
  private userServiceClient: UserServiceClient;

  constructor(@Inject('USERS_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userServiceClient =
      this.client.getService<UserServiceClient>('UserService');
  }

  @Get('health-check')
  async healthCheck() {
    return firstValueFrom(this.userServiceClient.healthCheck({}));
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return firstValueFrom(
      this.userServiceClient.getUser({ userId: req.user.id }),
    );
  }

  @UseGuards(AuthGuard)
  @Put('me')
  async updateProfile(@Req() req, @Body() updateData) {
    return firstValueFrom(
      this.userServiceClient.updateUser({
        userId: req.user.id,
        ...updateData,
      }),
    );
  }
}
