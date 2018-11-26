import { ICommand } from '@er/cqrs'

export class Enable2faVerifyCommand implements ICommand {
  constructor(
    public readonly verificationId: string,
    public readonly code: string,
  ) {}
}
