import { IsVerificationExists } from '@er/common'
import messages from '../messages'

export class VerifyDto {
  @IsVerificationExists({
    message: messages.invalidVerificationId,
  })
  readonly verificationId: string

  readonly code: string
}
