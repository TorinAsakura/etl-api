import { EventPublisher, ICommandHandler, CommandHandler } from '@nestjs/cqrs'
import { CreateAccountCommand } from '../impl'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@er/users'
import * as bcrypt from 'bcryptjs'
import { UserCreatedEvent } from '@er/users/src/events/impl'

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateAccountCommand) {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(command.password, salt)

    const user = this.publisher.mergeObjectContext(
      await this.userRepository.save(
        this.userRepository.create({
          login: command.login,
          email: command.email,
          password,
        }),
      ),
    )

    user.apply(new UserCreatedEvent(user.id, user.login, user.email))
    user.commit()

    return {}
  }
}
