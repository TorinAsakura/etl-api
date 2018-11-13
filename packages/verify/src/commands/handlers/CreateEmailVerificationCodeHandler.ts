import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { User } from '@er/users'
import { EmailVerificationCodeCreatedEvent } from '../../events/impl'
import { CreateEmailVerificationCodeCommand } from '../impl'
import { Verification } from '../../entities'
import { generatePassword } from '@er/common'

@CommandHandler(CreateEmailVerificationCodeCommand)
export class CreateEmailVerificationCodeHandler implements ICommandHandler<CreateEmailVerificationCodeCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,

    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateEmailVerificationCodeCommand) {
    const user = await this.userRepository.findOne({
      where: { id: command.userId },
      select: [ 'id', 'email' ],
    })

    const verification = this.publisher.mergeObjectContext(
      await this.verificationRepository.save(
        this.verificationRepository.create({
          user,
          verificationId: [uuid(), uuid()].join('').replace(/-/g, ''),
          verificationCode: generatePassword(6),
        }),
      ),
    )

    verification.apply(new EmailVerificationCodeCreatedEvent(
      verification.user.email,
      verification.verificationId,
      verification.verificationCode,
    ))

    verification.commit()

    return {}
  }
}
