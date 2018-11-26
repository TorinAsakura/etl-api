import { IsCurrentPassword, IsFieldEqual } from '../constraints'
import messages from '../messages'
import { User } from '../entities'

export class VerifyUpdatePasswordDto {
  readonly user: User

  readonly verificationId: string
  readonly code: string

  @IsCurrentPassword({
    message: messages.invalidCurrentPassword,
  })
  readonly current: string

  @IsFieldEqual('confirmation', {
    message: messages.passwordNotEqual,
  })
  readonly value: string
  readonly confirmation: string
}
