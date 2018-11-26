import { CommandBus, CommandHandler, ICommandHandler } from '@er/cqrs'
import { VerifyUpdatePasswordCommand } from '../impl'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from '../../entities'
import { VerifyCommand } from '@er/verify/src/commands/impl'
import messages from '../../messages'

@CommandHandler(VerifyUpdatePasswordCommand)
export class VerifyUpdatePasswordHandler implements ICommandHandler<VerifyUpdatePasswordCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: VerifyUpdatePasswordCommand) {
    const verifyResult = await this.commandBus.execute(
      new VerifyCommand(command.verificationId, command.code),
    )

    if (!verifyResult.isValid) {
      return {
        errors: {
          code: messages.invalidCode,
        },
      }
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(email) = LOWER(:email)', { email: verifyResult.consumer })
      .getOne()

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(command.value, salt)
    await this.userRepository.save(user)

    return {}
  }
}
