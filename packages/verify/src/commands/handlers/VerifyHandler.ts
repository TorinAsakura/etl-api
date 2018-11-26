import { CommandHandler, ICommandHandler } from '@er/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { VerifyCommand } from '../impl'
import { User } from '@er/users'
import { VerificationData } from '../../entities'
import { VerificationServiceFactory } from '../../service'
import { VerificationMethod } from '../../enums'

@CommandHandler(VerifyCommand)
export class VerifyHandler implements ICommandHandler<VerifyCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerificationData)
    private readonly verificationRepository: Repository<VerificationData>,
    private readonly verificationServiceFactory: VerificationServiceFactory,
  ) {}

  async execute(command: VerifyCommand) {
    const verificationData = await this.verificationRepository.findOne({
      where: {
        verificationId: command.verificationId,
      },
    })

    const user = await this.userRepository.findOne({
      where: {
        email: verificationData.consumer,
      },
    })

    if (user.verifyMethod === VerificationMethod.Email) {
      const verificationService = this.verificationServiceFactory.create(VerificationMethod.Email)
      return verificationService.validate(command.verificationId, command.code)
    } else {
      const verificationService = this.verificationServiceFactory.create(VerificationMethod.Authenticator)
      return verificationService.validate(command.verificationId, command.code)
    }
  }
}
