import { CommandHandler, ICommandHandler } from '@er/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Enable2faCommand } from '../impl'
import { User } from '@er/users'
import { VerificationServiceFactory } from '../../service'
import { VerificationMethod } from '../../enums'
import { VerificationParams } from '../../service/abstracts'

@CommandHandler(Enable2faCommand)
export class Enable2faHandler implements ICommandHandler<Enable2faCommand> {
  constructor(
    private readonly verificationServiceFactory: VerificationServiceFactory,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: Enable2faCommand) {
    const user = await this.userRepository.findOne({
      where: {
        id: command.userId,
      },
    })

    const verificationService = this.verificationServiceFactory.create(VerificationMethod.Authenticator)
    const verificationParams: VerificationParams = {
      consumer: user.email,
    }
    const verificationData = await verificationService.initiate(verificationParams)

    return {
      verificationId: verificationData.verificationId,
      totpUri: verificationData.totpUri,
      secret: verificationData.secret,
    }
  }
}
