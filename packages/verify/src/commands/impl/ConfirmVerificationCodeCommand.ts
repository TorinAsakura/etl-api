import { ICommand } from '@nestjs/cqrs'

export class ConfirmVerificationCodeCommand implements ICommand {
  constructor(
    public readonly verificationId: string,
    public readonly verificationCode: string,
  ) {}
}
