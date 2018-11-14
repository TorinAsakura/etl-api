import { NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import { MapErrorCodes } from '@er/common'
import { ApplicationModule } from './app'

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule)

  app.enableCors()

  useContainer(app, { fallback: true })

  app.useGlobalInterceptors(new MapErrorCodes())

  await app.listen(process.env.PORT || 3000)
}

bootstrap()
