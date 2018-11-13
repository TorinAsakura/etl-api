import { MinLength } from 'class-validator'

export class CreateUserDto {
  @MinLength(3, {
    message: 'sdfsdf dfsdfdf',
  })
  readonly login: string

  @MinLength(3, {
    message: 'sdfsdf dfsdfdf',
  })
  readonly email: string

  @MinLength(3, {
    message: 'sdfsdf dfsdfdf',
  })
  readonly password: string
}
