import { EventBus as NestEventBus } from '@nestjs/cqrs/dist/event-bus'

export class EventBus extends NestEventBus {
  setPubSub(pubSub: any) {
    pubSub.bridgeEventsTo(this.subject$)
    this.publisher = pubSub
  }
}
