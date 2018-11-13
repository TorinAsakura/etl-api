import { Module, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CQRSModule, EventBus, CommandBus, GlobalPubSub } from '@er/cqrs'
import { CommandHandlers } from './commands/handlers'
import { EventHandlers } from './events/handlers'
import { Resolvers } from './resolvers'
import { ModuleRef } from '@nestjs/core'
import { Verification } from './entities'
import { User } from '@er/users'
import { Constraints } from './constraints'

export * from './entities'

@Module({
  imports: [
    CQRSModule,
    TypeOrmModule.forFeature([
      Verification,
      User,
    ]),
  ],
  providers: [
    ...Resolvers,
    ...Constraints,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class VerifyModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly globalPubSub: GlobalPubSub,
  ) {}

  onModuleInit() {
    this.commandBus.setModuleRef(this.moduleRef)
    this.eventBus.setModuleRef(this.moduleRef)
    this.eventBus.setPubSub(this.globalPubSub)

    this.commandBus.register(CommandHandlers)
    this.eventBus.register(EventHandlers)
  }
}
