import { ICommand } from '@nestjs/cqrs'

export class GenerateTokenCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
