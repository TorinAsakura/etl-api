import { IEvent } from '@nestjs/cqrs'

export class EmailVerificationCodeCreatedEvent implements IEvent {
  constructor(
    public readonly email: string,
    public readonly verificationId: string,
    public readonly verificationCode: string,
  ) {}
}
