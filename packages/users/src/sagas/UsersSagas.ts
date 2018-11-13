import { Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map, filter } from 'rxjs/operators'
import { ICommand, EventObservable } from '@er/cqrs'
import { CreateEmailVerificationCodeCommand } from '@er/verify/src/commands/impl'
import { UserCreatedEvent } from '../events/impl'

@Injectable()
export class UsersSagas {
  userCreated = (events$: EventObservable<any>): Observable<ICommand> => {
    return events$
      .ofType(UserCreatedEvent)
      .pipe(
        filter(event => event.email),
        map(event => new CreateEmailVerificationCodeCommand(event.id)),
      )
  }
}
