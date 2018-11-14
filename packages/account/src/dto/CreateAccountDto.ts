import { MinLength, IsEmail  } from 'class-validator'
import { IsFieldEqual } from '@er/common'
import { IsEmailExists, IsLoginExists } from '../constraints'

export class CreateAccountDto {
  @MinLength(3)
  @IsLoginExists()
  readonly login: string

  @IsEmail()
  @IsEmailExists()
  readonly email: string

  readonly password: string

  @IsFieldEqual('password', {
    message: 'Password not equal',
  })
  readonly confirmPassword: string
}
