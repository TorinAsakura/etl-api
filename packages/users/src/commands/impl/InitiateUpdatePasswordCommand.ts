import { User } from '../../entities'

export class InitiateUpdatePasswordCommand {
  constructor(
    readonly user: User,
  ) {}
}
