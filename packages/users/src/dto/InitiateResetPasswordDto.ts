import { IsEmail } from 'class-validator'
import { IsEmailExists } from '../constraints'
import messages from '../messages'

export class InitiateResetPasswordDto {
  @IsEmail({}, {
    message: messages.invalidEmail,
  })
  @IsEmailExists({
    message: messages.invalidEmail,
  })
  readonly email: string
}
