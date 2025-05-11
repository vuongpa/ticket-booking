import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { GetUserByIdQuery } from '../../application/queries/get-user-by-id.query';

@Controller()
export class UserGrpcController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: { userId: string }) {
    const user = await this.queryBus.execute(new GetUserByIdQuery(data.userId));

    return {
      id: user.getId(),
      email: user.getEmail(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      memberId: user.getMemberId(),
      isActive: user.isUserActive(),
    };
  }

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const command = new CreateUserCommand(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
    );

    await this.commandBus.execute(command);
    const user = await this.queryBus.execute(new GetUserByIdQuery(data.email));

    return {
      userId: user.getId(),
      memberId: user.getMemberId(),
    };
  }
}
