import { Module } from '@nestjs/common'
import { EventPublisher } from '@nestjs/cqrs'
import { CommandBus } from './CommandBus'
import { EventBus } from './EventBus'

export * from '@nestjs/cqrs/dist/aggregate-root'
export * from '@nestjs/cqrs/dist/event-publisher'
export * from '@nestjs/cqrs/dist/interfaces'
export * from '@nestjs/cqrs/dist/utils'
export * from './GlobalPubSub'
export * from './CommandBus'
export * from './EventBus'

@Module({
  providers: [CommandBus, EventBus, EventPublisher],
  exports: [CommandBus, EventBus, EventPublisher],
})
export class CQRSModule {}
