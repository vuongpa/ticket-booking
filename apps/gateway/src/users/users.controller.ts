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

interface UserService {
  getUser(data: { userId: string }): Promise<any>;
  updateUser(data: {
    userId: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    address?: string;
  }): Promise<any>;
}

@Controller('api/v1/users')
export class UsersController implements OnModuleInit {
  private userService: UserService;

  constructor(@Inject('USERS_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return firstValueFrom(
      this.userService.getUser({ userId: req.user.id }) as any,
    );
  }

  @UseGuards(AuthGuard)
  @Put('me')
  async updateProfile(@Req() req, @Body() updateData) {
    return firstValueFrom(
      this.userService.updateUser({
        userId: req.user.id,
        ...updateData,
      }) as any,
    );
  }
}
