import { ICommand } from '@nestjs/cqrs'

export class GenerateTokenCommand implements ICommand {
  constructor(
    public readonly phone: string,
    public readonly password: string,
  ) {}
}
