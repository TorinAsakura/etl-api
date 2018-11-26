import { ICommandHandler, CommandHandler, CommandBus } from '@er/cqrs'
import { VerifyResetPasswordCommand } from '../impl'
import { User } from '../../entities'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import * as timespan from 'jsonwebtoken/lib/timespan'
import { VerifyCommand } from '@er/verify/src/commands/impl'
import * as bcrypt from 'bcryptjs'
import messages from '../../messages'

@CommandHandler(VerifyResetPasswordCommand)
export class VerifyResetPasswordHandler implements ICommandHandler<VerifyResetPasswordCommand> {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: VerifyResetPasswordCommand) {
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

    const token = this.jwtService.sign({ id: user.id })

    return {
      token: {
        expiresIn: timespan(process.env.AUTH_EXPIRES_IN || '7d'),
        token,
      },
    }
  }
}
