import { Injectable } from '@nestjs/common'
import { Mutation } from '@nestjs/graphql'
import { CreateUserDto } from '../dto'
import { Validate } from '@er/common'
import { CommandBus } from '@er/cqrs'
import { CreateUserCommand } from '../commands/impl'

@Injectable()
export class UserMutations {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation()
  @Validate(CreateUserDto)
  createUser(request, { input }) {
    return this.commandBus.execute(
      new CreateUserCommand(
        input.login,
        input.email,
        input.password,
      ),
    )
  }
}
