import { Injectable } from '@nestjs/common'
import { Query } from '@nestjs/graphql'
import { CommandBus } from '@er/cqrs'
import { MapParams } from '@er/common'
import { GenerateTokenCommand } from '../commands/impl'
import { LoginDto } from '../dto'

@Injectable()
export class AuthQueries {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Query()
  @MapParams(LoginDto)
  login(request, { phone, password }) {
    return this.commandBus.execute(
      new GenerateTokenCommand(phone, password),
    )
  }
}
