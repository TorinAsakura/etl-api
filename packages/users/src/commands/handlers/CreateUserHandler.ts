import { ICommandHandler, CommandHandler, EventPublisher } from '@er/cqrs'
import { CreateUserCommand } from '../impl'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { UserCreatedEvent } from '../../events/impl'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateUserCommand) {
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

    user.apply(new UserCreatedEvent(user.id, user.email))
    user.commit()

    return {}
  }
}
