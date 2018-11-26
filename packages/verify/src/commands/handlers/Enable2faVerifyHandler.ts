import { CommandHandler, ICommandHandler } from '@er/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@er/users'
import { VerificationServiceFactory } from '../../service'
import { VerificationMethod } from '../../enums'
import { Enable2faVerifyCommand } from '@er/accounts/src/commands/impl'

@CommandHandler(Enable2faVerifyCommand)
export class Enable2faVerifyHandler implements ICommandHandler<Enable2faVerifyCommand> {
  constructor(
    private readonly verificationServiceFactory: VerificationServiceFactory,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: Enable2faVerifyCommand) {
    const verificationService = this.verificationServiceFactory.create(VerificationMethod.Authenticator)
    const result = await verificationService.validate(command.verificationId, command.code)

    if (!result.isValid) {
      return {
        errors: {
          code: 'Is not valid',
        },
      }
    }

    const user = await this.userRepository.findOne({
      where: {
        email: result.consumer,
      },
    })

    user.verifyMethod = 'google_auth'
    await this.userRepository.save(user)

    return { result: true }
  }
}
