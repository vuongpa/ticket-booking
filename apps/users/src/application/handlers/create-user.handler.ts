import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { MemberIdGenerator } from '../../domain/services/member-id.generator';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly memberIdGenerator: MemberIdGenerator,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { email, password, firstName, lastName } = command;

    // Generate unique memberId
    const memberId = this.memberIdGenerator.generate();

    const user = User.create(
      uuidv4(),
      email,
      password,
      firstName,
      lastName,
      memberId,
    );

    await this.userRepository.save(user);
  }
}
