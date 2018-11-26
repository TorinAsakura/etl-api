import { Injectable } from '@nestjs/common'
import { Query } from '@nestjs/graphql'
import { CommandBus } from '@er/cqrs'
import { MapParams } from '@er/common'
import { SigninCommand, VerifyAndGenerateTokenCommand } from '../commands/impl'
import { LoginDto } from '../dto'
import { VerifyDto } from '@er/verify/src/dto'

@Injectable()
export class AuthQueries {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Query()
  @MapParams(LoginDto)
  signin(request, { email, password }) {
    return this.commandBus.execute(
      new SigninCommand(email, password),
    )
  }

  @Query()
  @MapParams(VerifyDto)
  signinVerify(request, { verificationId, code }) {
    return this.commandBus.execute(
      new VerifyAndGenerateTokenCommand(verificationId, code),
    )
  }
}
