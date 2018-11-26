import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoreModule } from './core'
import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql'
import { UsersModule } from '@er/users'
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { graphqlExpress } from 'apollo-server-express'
import graphqlPlayground from 'graphql-playground-middleware-express'
import { AuthModule, AuthMiddleware } from '@er/auth'
import { VerifyModule } from '@er/verify'
import { LocaleMiddleware, AccessGuard } from '@er/common'
import { APP_GUARD } from '@nestjs/core'
import { RolesModule } from '@er/roles'
import { AccountsModule } from '@er/accounts'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      database: process.env.DB_NAME || 'er',
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      entities: [
        '../**/src/**/entities/**.ts',
      ],
      migrations: [
        '../**/migrations/**.ts',
      ],
      migrationsRun: false,
      synchronize: true,
      logging: false,
    }),
    CoreModule,
    GraphQLModule,
    RolesModule,
    AuthModule,
    VerifyModule,
    UsersModule,
    AccountsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class ApplicationModule implements NestModule {
  constructor(
    private readonly graphQLFactory: GraphQLFactory,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const schema = this.graphQLFactory.createSchema({
      typeDefs: this.graphQLFactory.mergeTypesByPaths('../../**/*.graphql'),
      resolvers: {
        Date: GraphQLDate,
        Time: GraphQLTime,
        DateTime: GraphQLDateTime,
      },
    })

    consumer
      .apply(this.authMiddleware.resolve())
        .forRoutes('/graphql')
      .apply(LocaleMiddleware)
        .with(['ru', 'en'])
        .forRoutes('/graphql')
      .apply(graphqlExpress(request => ({ schema, context: { user: request.user }, rootValue: request })))
        .forRoutes('/graphql')
      .apply(graphqlPlayground({ endpoint: '/graphql' }))
        .forRoutes('/graphiql')
  }
}
