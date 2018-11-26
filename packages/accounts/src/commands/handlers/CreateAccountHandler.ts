import { CreateAccountCommand } from '../impl'
import { EventPublisher, ICommandHandler, CommandHandler } from '@er/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Account } from '../../entities'
import { User } from '@er/users/src/entities'
import { TradingRole } from '@er/roles'
import * as bcrypt from 'bcryptjs'
import { UserCreatedEvent } from '@er/users/src/events/impl'

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(TradingRole)
    private readonly tradingRoleRepository: Repository<TradingRole>,
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

    const tradingRole = await this.tradingRoleRepository.save(
      this.tradingRoleRepository.create({
        name: 'Account',
        permissions: [
          { resource: 'profile', action: 'create' },
          { resource: 'profile', action: 'read' },
          { resource: 'profile', action: 'update' },
        ],
      }),
    )

    const account = this.accountRepository.create({
      user,
      role: tradingRole,
    })

    return this.accountRepository.save(account)
  }
}
