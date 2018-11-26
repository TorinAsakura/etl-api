import { ICommand } from '@er/cqrs'

export class Enable2faCommand implements ICommand {
  constructor(
    public readonly userId: number,
  ) {}
}
