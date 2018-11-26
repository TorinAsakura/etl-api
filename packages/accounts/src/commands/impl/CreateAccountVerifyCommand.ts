import { ICommand } from '@er/cqrs'

export class CreateAccountVerifyCommand implements ICommand {
  constructor(
    public readonly verificationId: string,
    public readonly code: string,
  ) {}
}
