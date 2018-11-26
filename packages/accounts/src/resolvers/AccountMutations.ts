import { Injectable } from '@nestjs/common'
import { CommandBus } from '@er/cqrs'
import { Mutation } from '@nestjs/graphql'
import { AuthAccess, Validate } from '@er/common'
import { CreateAccountDto, CreateAccountVerifyDto, VerifyDto } from '../dto'
import { CreateAccountCommand, CreateAccountVerifyCommand, Enable2faVerifyCommand } from '../commands/impl'
import { Enable2faCommand } from '@er/verify/src/commands/impl'

@Injectable()
export class AccountMutations {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation()
  @Validate(CreateAccountDto)
  async createAccount(request, { input }) {
    const result = await this.commandBus.execute(
      new CreateAccountCommand(
        input.login,
        input.email,
        input.password,
      ),
    )
    return { result }
  }

  @Mutation()
  @Validate(CreateAccountVerifyDto)
  async createAccountVerify(request, { input }) {
    return this.commandBus.execute(
      new CreateAccountVerifyCommand(
        input.verificationId,
        input.code,
      ),
    )
  }

  @Mutation()
  @AuthAccess()
  async enable2fa(request) {
    const result = await this.commandBus.execute(
      new Enable2faCommand(request.user.id),
    )

    return result
  }

  @Mutation()
  @AuthAccess()
  @Validate(VerifyDto)
  async enable2faVerify(request, { input }) {
    const result = await this.commandBus.execute(
      new Enable2faVerifyCommand(
        input.verificationId,
        input.code,
      ),
    )

    return result
  }
}
