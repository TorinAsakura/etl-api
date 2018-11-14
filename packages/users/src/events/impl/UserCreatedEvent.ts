import { IEvent } from '@nestjs/cqrs'

export class UserCreatedEvent implements IEvent {
  constructor(
    public readonly id: number,
    public readonly login: string,
    public readonly email: string,
  ) {}
}
