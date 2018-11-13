import { Module, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities'
import { ModuleRef } from '@nestjs/core'
import { CQRSModule, EventBus, CommandBus, GlobalPubSub } from '@er/cqrs'
import { CommandHandlers } from './commands/handlers'
import { EventHandlers } from './events/handlers'
import { Resolvers } from './resolvers'
import { UsersSagas } from './sagas'

export * from './entities'

@Module({
  imports: [
    CQRSModule,
    TypeOrmModule.forFeature([
      User,
    ]),
  ],
  providers: [
    ...Resolvers,
    ...CommandHandlers,
    ...EventHandlers,
    UsersSagas,
  ],
})
export class UsersModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly globalPubSub: GlobalPubSub,
    private readonly usersSagas: UsersSagas,
  ) {}

  onModuleInit() {
    this.commandBus.setModuleRef(this.moduleRef)
    this.eventBus.setModuleRef(this.moduleRef)
    this.eventBus.setPubSub(this.globalPubSub)

    this.commandBus.register(CommandHandlers)
    this.eventBus.register(EventHandlers)

    this.eventBus.combineSagas([
      this.usersSagas.userCreated,
    ])
  }
}
