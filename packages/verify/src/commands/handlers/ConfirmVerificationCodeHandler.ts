import { CommandHandler, ICommandHandler } from '@er/cqrs'
import { ConfirmVerificationCodeCommand } from '../impl'
import { VerificationServiceFactory } from '../../service'
import { VerificationMethod } from '../../enums'

@CommandHandler(ConfirmVerificationCodeCommand)
export class ConfirmVerificationCodeHandler implements ICommandHandler<ConfirmVerificationCodeCommand> {
  constructor(
    private readonly verificationServiceFactory: VerificationServiceFactory,
  ) {}

  async execute(command: ConfirmVerificationCodeCommand) {
    const verificationService = this.verificationServiceFactory.create(VerificationMethod.Email)
    return verificationService.validate(command.verificationId, command.verificationCode)
  }
}
