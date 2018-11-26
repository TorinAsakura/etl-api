import { ICommand } from '@er/cqrs'
export class VerifyResetPasswordCommand implements ICommand {
  constructor(
    readonly verificationId: string,
    readonly code: string,

    readonly value: string,
    readonly confirmation: string,
  ) {}
}
