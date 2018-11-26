import { CommandBus, ICommandHandler, CommandHandler } from '@er/cqrs'
import { SigninCommand } from '../impl'
import { User } from '@er/users'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import messages from '../../messages'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import * as timespan from 'jsonwebtoken/lib/timespan'
import { InitiateVerifyCommand } from '@er/verify/src/commands/impl'

@CommandHandler(SigninCommand)
export class SigninHandler implements ICommandHandler<SigninCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: SigninCommand) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(email) = LOWER(:email)', { email: command.email })
      .getOne()

    if (!user) {
      return {
        errors: {
          email: messages.invalidEmailOrPassword,
        },
      }
    }

    if (!await bcrypt.compare(command.password, user.password)) {
      return {
        errors: {
          password: messages.invalidEmailOrPassword,
        },
      }
    }

    if (user.verifyMethod === 'email') {
      const token = this.jwtService.sign({ id: user.id })

      return {
        token: {
          expiresIn: timespan(process.env.AUTH_EXPIRES_IN || '7d'),
          token,
        },
      }
    }

    const verification = await this.commandBus.execute(new InitiateVerifyCommand(user.id))

    return {
      verificationId: verification.verificationId,
      verifyMethod: user.verifyMethod,
    }
  }
}
