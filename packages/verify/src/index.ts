import { Module, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CQRSModule, EventBus, CommandBus, GlobalPubSub } from '@er/cqrs'
import { CommandHandlers } from './commands/handlers'
import { EventHandlers } from './events/handlers'
import { Resolvers } from './resolvers'
import { ModuleRef } from '@nestjs/core'
import { AuthenticatorSecret, Verification, VerificationData } from './entities'
import { User } from '@er/users'
import { Constraints } from './constraints'
import { VerificationServiceFactory } from './service'

export * from './entities'
export * from './service'

@Module({
  imports: [
    CQRSModule,
    TypeOrmModule.forFeature([
      Verification,
      User,
      VerificationData,
      AuthenticatorSecret,
    ]),
  ],
  providers: [
    ...Resolvers,
    ...Constraints,
    ...CommandHandlers,
    ...EventHandlers,
    VerificationServiceFactory,
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
