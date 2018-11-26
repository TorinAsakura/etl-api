import { ICommand } from '@er/cqrs'

export class VerifyCommand implements ICommand {
  constructor(
    public readonly verificationId: string,
    public readonly code: string,
  ) {}
}
