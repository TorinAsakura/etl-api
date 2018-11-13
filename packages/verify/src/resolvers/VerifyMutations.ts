import { Injectable } from '@nestjs/common'
import { CommandBus } from '@er/cqrs'
import { Mutation } from '@nestjs/graphql'
import { Validate } from '@er/common'
import { ConfirmVerificationCodeDto } from '../dto'
import { ConfirmVerificationCodeCommand } from '../commands/impl'

@Injectable()
export class VerifyMutations {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation()
  @Validate(ConfirmVerificationCodeDto)
  confirmVerificationCode(request, { input }) {
    return this.commandBus.execute(
      new ConfirmVerificationCodeCommand(input.verificationId, input.verificationCode),
    )
  }
}
