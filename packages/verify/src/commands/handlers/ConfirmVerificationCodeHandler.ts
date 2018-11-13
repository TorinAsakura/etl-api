import { ICommandHandler, CommandHandler } from '@er/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfirmVerificationCodeCommand } from '../impl'
import { User } from '@er/users'
import { Verification } from '../../entities'

@CommandHandler(ConfirmVerificationCodeCommand)
export class ConfirmVerificationCodeHandler implements ICommandHandler<ConfirmVerificationCodeCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
  ) {}

  async execute(command: ConfirmVerificationCodeCommand) {
    const verification = await this.verificationRepository.findOne({
      where: {
        verificationId: command.verificationId,
        verificationCode: command.verificationCode,
      },
      relations: ['user'],
    })

    verification.user.isVerified = true
    await this.userRepository.save(verification.user)

    return {}
  }
}
