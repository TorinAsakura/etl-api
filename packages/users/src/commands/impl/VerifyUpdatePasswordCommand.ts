import { ICommand } from '@er/cqrs'

export class VerifyUpdatePasswordCommand implements ICommand {
  constructor(
    readonly verificationId: string,
    readonly code: string,
    readonly value: string,
  ) {}
}
