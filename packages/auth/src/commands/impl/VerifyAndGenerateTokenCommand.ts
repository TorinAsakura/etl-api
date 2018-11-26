import { ICommand } from '@er/cqrs'

export class VerifyAndGenerateTokenCommand implements ICommand {
  constructor(
    readonly verificationId: string,
    readonly code: string,
  ) {}
}
