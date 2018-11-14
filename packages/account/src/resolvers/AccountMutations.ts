import { Injectable } from '@nestjs/common'
import { CommandBus } from '@er/cqrs'
import { Validate } from '@er/common'
import { Mutation } from '@nestjs/graphql'
import { CreateAccountDto } from '../dto'
import { CreateAccountCommand } from '../commands/impl'

@Injectable()
export class AccountMutations {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation()
  @Validate(CreateAccountDto)
  createAccount(request, { input }) {
    return this.commandBus.execute(
      new CreateAccountCommand(
        input.login,
        input.email,
        input.password,
      ),
    )
  }
}
