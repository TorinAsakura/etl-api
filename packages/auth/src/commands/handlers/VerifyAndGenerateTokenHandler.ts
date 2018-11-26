import { ICommandHandler, CommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import * as timespan from 'jsonwebtoken/lib/timespan'
import { User } from '@er/users'
import { VerifyAndGenerateTokenCommand } from '../impl'
import { CommandBus } from '@er/cqrs'
import { VerifyCommand } from '@er/verify/src/commands/impl'

@CommandHandler(VerifyAndGenerateTokenCommand)
export class VerifyAndGenerateTokenHandler implements ICommandHandler<VerifyAndGenerateTokenCommand> {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: VerifyAndGenerateTokenCommand) {
    const verifyResult = await this.commandBus.execute(
      new VerifyCommand(command.verificationId, command.code),
    )

    if (!verifyResult.isValid) {
      return {
        errors: {
          code: 'Is not valid',
        },
      }
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(email) = LOWER(:email)', { email: verifyResult.consumer })
      .getOne()

    const token = this.jwtService.sign({ id: user.id })

    return {
      token: {
        expiresIn: timespan(process.env.AUTH_EXPIRES_IN || '7d'),
        token,
      },
    }
  }
}
