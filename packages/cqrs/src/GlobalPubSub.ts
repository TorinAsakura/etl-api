import { Subject } from 'rxjs'
import { IEvent } from '@nestjs/cqrs/dist/interfaces'
import { IEventPublisher } from '@nestjs/cqrs/dist/interfaces/events/event-publisher.interface'
import { IMessageSource } from '@nestjs/cqrs/dist/interfaces/events/message-source.interface'

export class GlobalPubSub implements IEventPublisher, IMessageSource {
  private subjects: Set<Subject<any>> = new Set()

  publish<T extends IEvent>(event: T) {
    this.subjects.forEach(subject => subject.next(event))
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
    if (!this.subjects.has(subject)) {
      this.subjects.add(subject)
    }
  }
}
