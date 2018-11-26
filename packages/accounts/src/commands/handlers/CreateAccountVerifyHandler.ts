import { CommandBus, CommandHandler, ICommandHandler } from '@er/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAccountVerifyCommand } from '../impl'
import { User } from '@er/users/src/entities'
import { ConfirmVerificationCodeCommand } from '@er/verify/src/commands/impl'
import { JwtService } from '@nestjs/jwt'
import * as timespan from 'jsonwebtoken/lib/timespan'

@CommandHandler(CreateAccountVerifyCommand)
export class CreateAccountVerifyHandler implements ICommandHandler<CreateAccountVerifyCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: CreateAccountVerifyCommand) {
    const { consumer } = await this.commandBus.execute(
      new ConfirmVerificationCodeCommand(command.verificationId, command.code),
    )

    const user = await this.userRepository.findOne({
      where: {
        email: consumer,
      },
    })

    user.isVerified = true
    await this.userRepository.save(user)

    const token = this.jwtService.sign({ id: user.id })
    return {
      token: {
        expiresIn: timespan(process.env.AUTH_EXPIRES_IN || '7d'),
        token,
      },
    }
  }
}
