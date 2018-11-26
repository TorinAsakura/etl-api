import { IsValidCode, IsVerificationExists } from '@er/common'
import messages from '../messages'

export class CreateAccountVerifyDto {
  @IsVerificationExists({
    message: messages.invalidVerificationId,
  })
  readonly verificationId: string

  @IsValidCode({
    message: messages.invalidCode,
  })
  readonly code: string
}
