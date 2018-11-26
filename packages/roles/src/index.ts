import { OnModuleInit, Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CQRSModule, EventBus, CommandBus, GlobalPubSub } from '@er/cqrs'
import { CommandHandlers } from './commands/handlers'
import { Resolvers } from './resolvers'
import { EventHandlers } from './events/handlers'
import { Role, TradingRole } from './entities'

export * from './entities'

@Module({
  imports: [
    CQRSModule,
    TypeOrmModule.forFeature([
      TradingRole,
      Role,
    ]),
  ],
  providers: [
    ...Resolvers,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class RolesModule implements OnModuleInit {
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
