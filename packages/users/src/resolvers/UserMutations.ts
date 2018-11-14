import { Injectable } from '@nestjs/common'
import { Mutation } from '@nestjs/graphql'
import { Validate } from '@er/common'
import { CommandBus } from '@er/cqrs'

@Injectable()
export class UserMutations {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

}
