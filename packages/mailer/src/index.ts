import { NestFactory } from '@nestjs/core'
import { IntlProvider } from '@er/intl'
import { SqsQueueServer } from './microservices/SqsQueueServer'
import { ApplicationModule } from './app'
import { Renderer } from './renderer'

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ApplicationModule, {
    strategy: new SqsQueueServer({
      url: process.env.QUEUE_URL,
      key: process.env.QUEUE_KEY,
      secret: process.env.QUEUE_SECRET,
      region: process.env.QUEUE_REGION,
    }),
  })

  await app.select(ApplicationModule)
           .get(Renderer)
           .load()

  await app.select(ApplicationModule)
           .get(IntlProvider)
           .load()

  await app.listenAsync()
}

bootstrap()
