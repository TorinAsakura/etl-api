import { ICommand } from '@er/cqrs'

export class InitiateResetPasswordCommand implements ICommand {
  constructor(
    readonly email: string,
  ) {}
}
