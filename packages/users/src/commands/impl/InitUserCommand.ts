import { ICommand } from '@nestjs/cqrs'

export class InitUserCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly email: string,
  ) {}
}
