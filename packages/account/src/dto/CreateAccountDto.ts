import { MinLength, IsEmail  } from 'class-validator'
import { IsFieldEqual } from '@er/common'
import { IsEmailExists, IsLoginExists } from '../constraints'
import messages from '../messages'

export class CreateAccountDto {
  @MinLength(3, {
    message: messages.minLength,
  })
  @IsLoginExists({
    message: messages.loginExists,
  })
  readonly login: string

  @IsEmail({}, {
    message: messages.invalidEmail,
  })
  @IsEmailExists({
    message: messages.emailExists,
  })
  readonly email: string

  readonly password: string

  @IsFieldEqual('password', {
    message: messages.confirmPassword,
  })
  readonly confirmPassword: string
}
