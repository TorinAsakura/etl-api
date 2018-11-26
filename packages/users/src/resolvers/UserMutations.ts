import { Injectable } from '@nestjs/common'
import { Mutation } from '@nestjs/graphql'
import { AuthAccess, Validate } from '@er/common'
import { CommandBus } from '@er/cqrs'
import {
  InitiateResetPasswordCommand,
  InitiateUpdatePasswordCommand, VerifyResetPasswordCommand,
  VerifyUpdatePasswordCommand,
} from '../commands/impl'
import { InitiateResetPasswordDto, VerifyResetPasswordDto, VerifyUpdatePasswordDto } from '../dto'

@Injectable()
export class UserMutations {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Mutation()
  @AuthAccess()
  async initiateUpdatePassword(request) {
    return this.commandBus.execute(
      new InitiateUpdatePasswordCommand(
        request.user,
      ),
    )
  }

  @Mutation()
  @AuthAccess()
  @Validate(VerifyUpdatePasswordDto)
  async verifyUpdatePassword(request, { input }) {
    return this.commandBus.execute(
      new VerifyUpdatePasswordCommand(
        input.verificationId,
        input.code,
        input.value,
      ),
    )
  }

  @Mutation()
  @Validate(InitiateResetPasswordDto)
  async initiateResetPassword(request, { input }) {
    return this.commandBus.execute(
      new InitiateResetPasswordCommand(
        input.email,
      ),
    )
  }

  @Mutation()
  @Validate(VerifyResetPasswordDto)
  async verifyResetPassword(request, { input }) {
    return this.commandBus.execute(
      new VerifyResetPasswordCommand(
        input.verificationId,
        input.code,
        input.value,
        input.confirmation,
      ),
    )
  }
}
