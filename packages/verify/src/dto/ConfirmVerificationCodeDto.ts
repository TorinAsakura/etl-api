import { IsVerificationCodeValid } from '../constraints'

export class ConfirmVerificationCodeDto {
  public readonly verificationId: string

  @IsVerificationCodeValid({
    message: 'Invalid code',
  })
  public readonly verificationCode: string
}
