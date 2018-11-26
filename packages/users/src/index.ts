import { Module, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities'
import { ModuleRef } from '@nestjs/core'
import { CQRSModule, EventBus, CommandBus, GlobalPubSub } from '@er/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { CommandHandlers } from './commands/handlers'
import { EventHandlers } from './events/handlers'
import { Resolvers } from './resolvers'
import { UsersSagas } from './sagas'
import { Constraints } from './constraints'

export * from './entities'

@Module({
  imports: [
    CQRSModule,
    TypeOrmModule.forFeature([
      User,
    ]),
    JwtModule.register({
      secretOrPrivateKey: process.env.AUTH_SECRET || 'supersecret',
      signOptions: {
        expiresIn: process.env.AUTH_EXPIRES_IN || '7d',
      },
    }),
  ],
  providers: [
    ...Constraints,
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
