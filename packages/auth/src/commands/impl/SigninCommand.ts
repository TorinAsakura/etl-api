import { ICommand } from '@er/cqrs'

export class SigninCommand implements ICommand {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {}
}
