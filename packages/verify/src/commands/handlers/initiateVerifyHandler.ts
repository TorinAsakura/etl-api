import { ICommandHandler, CommandHandler } from '@er/cqrs'
import { InitiateVerifyCommand } from '../impl'
import { User } from '@er/users'
import { Repository } from 'typeorm'
import { VerificationServiceFactory } from '../../service'
import { InjectRepository } from '@nestjs/typeorm'
import { VerificationMethod } from '../../enums'

@CommandHandler(InitiateVerifyCommand)
export class InitiateVerifyHandler implements ICommandHandler<InitiateVerifyCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly verificationServiceFactory: VerificationServiceFactory,
  ) {}

  async execute(command: InitiateVerifyCommand) {
    const user = await this.userRepository.findOne({
      where: {
        id: command.userId,
      },
    })

    if (user.verifyMethod === VerificationMethod.Email) {
      const verifyService = this.verificationServiceFactory.create(VerificationMethod.Email)
      return verifyService.initiate({
        consumer: user.email,
        payload: command.scope,
      })
    } else {
      const verifyService = this.verificationServiceFactory.create(VerificationMethod.Authenticator)
      return verifyService.initiate({
        consumer: user.email,
        payload: 'login',
      })
    }
  }
}
