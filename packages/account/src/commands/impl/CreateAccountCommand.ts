import { ICommand } from '@nestjs/cqrs'

export class CreateAccountCommand implements ICommand {
  constructor(
    public readonly login: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}
