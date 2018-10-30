import { ICommandHandler, CommandHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import * as timespan from 'jsonwebtoken/lib/timespan'
import { User } from '@er/users'
import { GenerateTokenCommand } from '../impl'
import messages from '../../messages'

@CommandHandler(GenerateTokenCommand)
export class GenerateTokenHandler implements ICommandHandler<GenerateTokenCommand> {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: GenerateTokenCommand) {
    const user = await this.userRepository
     .createQueryBuilder('user')
     .where('LOWER(phone) = LOWER(:phone)', { phone: command.phone })
     .getOne()

    if (!user) {
      return {
        errors: {
          phone: messages.phoneNotFound,
        },
      }
    }

    if (!await bcrypt.compare(command.password, user.password)) {
      return {
        errors: {
          password: messages.invalidPassword,
        },
      }
    }

    const token = this.jwtService.sign({ id: user.id })

    return {
      token: {
        expiresIn: timespan(process.env.AUTH_EXPIRES_IN || '7d'),
        token,
      },
    }
  }
}
