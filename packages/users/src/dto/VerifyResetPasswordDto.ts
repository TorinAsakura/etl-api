import { IsFieldEqual } from '../constraints'
import messages from '../messages'

export class VerifyResetPasswordDto {
  readonly verificationId: string
  readonly code: string

  @IsFieldEqual('confirmation', {
    message: messages.passwordNotEqual,
  })
  readonly value: string
  readonly confirmation: string
}
