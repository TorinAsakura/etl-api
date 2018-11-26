import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@er/users'
import { CreateEmailVerificationCodeCommand } from '../impl'
import { VerificationServiceFactory } from '../../service'
import { VerificationMethod } from '../../enums'
import { VerificationParams } from '../../service/abstracts'

@CommandHandler(CreateEmailVerificationCodeCommand)
export class CreateEmailVerificationCodeHandler implements ICommandHandler<CreateEmailVerificationCodeCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly verificationServiceFactory: VerificationServiceFactory,
  ) {}

  async execute(command: CreateEmailVerificationCodeCommand) {
    const user = await this.userRepository.findOne({
      where: { id: command.userId },
      select: [ 'id', 'email' ],
    })

    const verificationService = this.verificationServiceFactory.create(VerificationMethod.Email)
    const verificationParams: VerificationParams = {
      consumer: user.email,
      payload: 'register',
    }
    const verification = await verificationService.initiate(verificationParams)

    return {
      verificationId: verification.verificationId,
    }
  }
}
