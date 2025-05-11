import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../commands/update-user.command';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UpdateUserCommand) {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${command.userId} not found`);
    }

    if (command.email) {
      user.updateEmail(command.email);
    }

    if (command.firstName || command.lastName) {
      user.updateProfile(
        command.firstName || user.getFirstName(),
        command.lastName || user.getLastName(),
      );
    }

    await this.userRepository.save(user);
    return user;
  }
}
