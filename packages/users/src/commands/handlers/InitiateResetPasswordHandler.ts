import { CommandBus, CommandHandler, ICommandHandler } from '@er/cqrs'
import { InitiateResetPasswordCommand } from '../impl'
import { InitiateVerifyCommand } from '@er/verify/src/commands/impl'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities'
import { Repository } from 'typeorm'

@CommandHandler(InitiateResetPasswordCommand)
export class InitiateResetPasswordHandler implements ICommandHandler<InitiateResetPasswordCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: InitiateResetPasswordCommand) {
    const user = await this.userRepository.findOne({
      where: {
        email: command.email,
      },
    })
    const verification = await this.commandBus.execute(new InitiateVerifyCommand(user.id))

    return {
      verificationId: verification.verificationId,
      verifyMethod: user.verifyMethod,
    }
  }
}
