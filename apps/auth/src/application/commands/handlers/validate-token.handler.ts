import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValidateTokenCommand } from '../validate-token.command';
import { JwtService } from '../../../infrastructure/services/jwt.service';

@CommandHandler(ValidateTokenCommand)
export class ValidateTokenHandler
  implements ICommandHandler<ValidateTokenCommand>
{
  constructor(private readonly jwtService: JwtService) {}

  execute(
    command: ValidateTokenCommand,
  ): Promise<{ valid: boolean; userId?: string }> {
    const { token } = command;

    const payload = this.jwtService.validateToken(token);
    if (!payload) {
      return Promise.resolve({
        valid: false,
      });
    }

    return Promise.resolve({
      valid: true,
      userId: payload.sub,
    });
  }
}
