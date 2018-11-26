import { ICommand } from '@er/cqrs'

export class InitiateVerifyCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly scope?: string,
  ) {}
}
