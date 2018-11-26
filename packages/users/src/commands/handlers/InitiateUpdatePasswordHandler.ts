import { InitiateUpdatePasswordCommand } from '../impl'
import { ICommandHandler, CommandHandler, CommandBus } from '@er/cqrs'
import { InitiateVerifyCommand } from '@er/verify/src/commands/impl'

@CommandHandler(InitiateUpdatePasswordCommand)
export class InitiateUpdatePasswordHandler implements ICommandHandler<InitiateUpdatePasswordCommand> {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: InitiateUpdatePasswordCommand) {
    const user = command.user
    const verification = await this.commandBus.execute(new InitiateVerifyCommand(user.id, 'change_password'))

    return {
      verificationId: verification.verificationId,
      verifyMethod: user.verifyMethod,
    }
  }
}
