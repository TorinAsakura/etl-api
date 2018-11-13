import { ICommand } from '@nestjs/cqrs'

export class CreateEmailVerificationCodeCommand implements ICommand {
  constructor(
    public readonly userId: number,
  ) {}
}
