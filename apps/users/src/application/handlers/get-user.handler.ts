import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries/get-user.query';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserQuery) {
    const user = await this.userRepository.findById(query.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${query.userId} not found`);
    }
    return user;
  }
}
