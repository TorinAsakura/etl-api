import { IEventHandler, EventsHandler } from '@er/cqrs'
import { createClient } from '@er/mailer/src/client'
import { EmailVerificationCodeCreatedEvent } from '../impl'

@EventsHandler(EmailVerificationCodeCreatedEvent)
export class SendVerificationCodeHandler implements IEventHandler<EmailVerificationCodeCreatedEvent> {
  handle(event: EmailVerificationCodeCreatedEvent): any {
    const client = createClient()

    client.send('verification-code', event.email, 'en', event)
  }
}
