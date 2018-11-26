export class CreateAccountDto {
  readonly login: string
  readonly email: string
  readonly password: string
  readonly confirmPassword: string
}
