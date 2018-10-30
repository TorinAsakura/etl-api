import { OnModuleInit, Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { CQRSModule, EventBus, CommandBus } from '@av/cqrs'
import { User } from '@er/users'
import { Resolvers } from './resolvers'
import { CommandHandlers } from './commands/handlers'
import { AuthMiddleware } from './middlewares/AuthMiddleware'

export * from './middlewares/AuthMiddleware'

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
    ]),
  ],
  providers: [
    AuthMiddleware,
    ...Resolvers,
    ...CommandHandlers,
  ],
  exports: [
    AuthMiddleware,
  ],
})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  onModuleInit() {
    this.commandBus.setModuleRef(this.moduleRef)
    this.eventBus.setModuleRef(this.moduleRef)

    this.commandBus.register(CommandHandlers)
  }
}
