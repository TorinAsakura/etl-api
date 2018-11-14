import IntlMessageFormat from 'intl-messageformat'

interface Messages {
  [key: string]: string
}

export class Intl {
  private locale: string
  private messages: Messages

  constructor(locale: string, messages: Messages) {
    this.locale = locale
    this.messages = messages || {}
  }

  formatMessage(messageDescriptor, options = {}) {
    if (!messageDescriptor) {
      console.log(`Message descriptor ${messageDescriptor} not found.`) // tslint:disable-line:no-console

      return ''
    }

    if (typeof messageDescriptor === 'string') {
      messageDescriptor = {
        id: messageDescriptor,
        defaultMessage: messageDescriptor,
      }
    }

    const message = this.messages[messageDescriptor.id] || messageDescriptor.defaultMessage

    if (!message) {
      return messageDescriptor.id
    }

    const messageFmt = new IntlMessageFormat(message, this.locale)

    return messageFmt.format(options)
  }
}
