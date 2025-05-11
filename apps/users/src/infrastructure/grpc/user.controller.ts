import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';
import { GetUserQuery } from '../../application/queries/get-user.query';
import { UpdateUserCommand } from '../../application/commands/update-user.command';

@Controller()
export class UserGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('UserService', 'HealthCheck')
  healthCheck() {
    return { message: 'Hello, world!' };
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: { userId: string }) {
    const query = new GetUserQuery(data.userId);
    const user = await this.queryBus.execute(query);
    return {
      id: user.getId(),
      email: user.getEmail(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      memberId: user.getMemberId(),
      isActive: user.isUserActive(),
    };
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(data: {
    userId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }) {
    const command = new UpdateUserCommand(
      data.userId,
      data.email,
      data.firstName,
      data.lastName,
    );
    const user = await this.commandBus.execute(command);
    return {
      id: user.getId(),
      email: user.getEmail(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      memberId: user.getMemberId(),
      isActive: user.isUserActive(),
    };
  }
}
