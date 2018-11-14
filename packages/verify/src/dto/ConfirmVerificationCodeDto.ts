import { IsVerificationCodeValid } from '../constraints'
import messages from '../messages'

export class ConfirmVerificationCodeDto {
  public readonly verificationId: string

  @IsVerificationCodeValid({
    message: messages.invalidVerificationCode,
  })
  public readonly verificationCode: string
}
