import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { IntlProvider } from '@er/intl'
import { Transport } from '../transport'
import { Renderer } from '../renderer'

interface SendMailData {
  locale: string
  template: string
  to: string
  variables: any
}

@Controller()
export class SendMailController {
  constructor(
    private readonly intlProvider: IntlProvider,
    private readonly transport: Transport,
    private readonly renderer: Renderer,
  ) {}

  @MessagePattern({ cmd: 'send' })
  async send(data: SendMailData) {
    const intl = this.intlProvider.create(data.locale)

    const template = this.renderer.getTemplate(data.template)

    const { content, subject } = template.render(intl, data.variables)

    await this.transport.send(data.to, subject, content)
  }
}
