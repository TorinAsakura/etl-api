import { Module } from '@nestjs/common'
import { SendMailController } from './controllers/SendMailController'
import { IntlProvider } from '@er/intl'
import { Transport } from './transport'
import { Renderer } from './renderer'

@Module({
  controllers: [SendMailController],
  providers: [
    IntlProvider,
    Renderer,
    Transport,
  ],
})
export class ApplicationModule {}
