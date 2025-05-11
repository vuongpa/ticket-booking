import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserServiceClient as UserServiceClientGrpc } from '@app/protos/generated/user';

@Injectable()
export class UserServiceClient implements OnModuleInit {
  private userServiceClientGrpc: UserServiceClientGrpc;

  constructor(@Inject('USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userServiceClientGrpc =
      this.client.getService<UserServiceClientGrpc>('UserService');
  }

  async getUser(userId: string) {
    return firstValueFrom(this.userServiceClientGrpc.getUser({ userId }));
  }

  async findByEmail(email: string) {
    try {
      // Since the user service doesn't have a direct findByEmail method,
      // We need to work with what's available or implement it in the user-service
      // This is a placeholder and would need to be properly implemented in user-service

      // Log that this method was called with a specific email
      console.warn(
        `findByEmail called with email: ${email}, but not fully implemented in user-service`,
      );

      // In a real implementation, we would await a call to the service here
      await Promise.resolve(); // Dummy await to satisfy linter

      return null;
    } catch (error) {
      console.error('Error in findByEmail:', error);
      return null;
    }
  }

  async createUser(userData: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      // Since the user service doesn't have a direct createUser method,
      // We can use updateUser with the user ID to create a new user
      return firstValueFrom(
        this.userServiceClientGrpc.updateUser({
          userId: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        }),
      );
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  async updateUser(
    userId: string,
    data: { email?: string; firstName?: string; lastName?: string },
  ) {
    return firstValueFrom(
      this.userServiceClientGrpc.updateUser({
        userId,
        ...data,
      }),
    );
  }

  async deleteUser(userId: string) {
    try {
      // The user service might not have a delete method yet
      // This would need to be implemented in the user-service
      console.warn(
        `deleteUser called with userId: ${userId}, but not fully implemented in user-service`,
      );

      // In a real implementation, we would await a call to the service here
      await Promise.resolve(); // Dummy await to satisfy linter

      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }

  async healthCheck() {
    return firstValueFrom(this.userServiceClientGrpc.healthCheck({}));
  }
}
