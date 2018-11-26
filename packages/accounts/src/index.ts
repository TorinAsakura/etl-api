import { OnModuleInit, Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CQRSModule, EventBus, CommandBus, GlobalPubSub } from '@er/cqrs'
import { CommandHandlers } from './commands/handlers'
import { Resolvers } from './resolvers'
import { EventHandlers } from './events/handlers'
import { Account } from './entities'
import { TradingRole } from '@er/roles'
import { User } from '@er/users'
import { Constraints as CommonConstraints } from '@er/common'
import { JwtModule } from '@nestjs/jwt'

export * from './entities'

@Module({
  imports: [
    CQRSModule,
    JwtModule.register({
      secretOrPrivateKey: process.env.AUTH_SECRET || 'supersecret',
      signOptions: {
        expiresIn: process.env.AUTH_EXPIRES_IN || '7d',
      },
    }),
    TypeOrmModule.forFeature([
      User,
      Account,
      TradingRole,
    ]),
  ],
  providers: [
    ...CommonConstraints,
    ...Resolvers,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class AccountsModule implements OnModuleInit {
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
