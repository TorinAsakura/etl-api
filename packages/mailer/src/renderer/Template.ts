import * as path from 'path'
import { readFileAsync } from 'fs-extra-promise'
import mjml2html from 'mjml'
import includesMessages from '../templates/includes/messages'

export default class Template {
  private renderer: any
  private html: string
  private name: string
  private path: string
  private messages: any

  constructor(templateDir: string, renderer) {
    this.renderer = renderer
    this.name = path.basename(templateDir)
    this.path = templateDir
  }

  getName() {
    return this.name
  }

  getSubject() {
    return this.messages.subject
  }

  async loadTemplate() {
    const filePath = path.join(this.path, 'template.mjml')

    const content = await readFileAsync(filePath)

    const { html, errors } = mjml2html(content.toString(), { filePath })

    if (errors && errors.length > 0) {
      console.log(errors) // tslint:disable-line:no-console
    }

    return html
  }

  loadMessages() {
    const templateMessages = require(path.join(this.path, 'messages')).default

    return {
      ...includesMessages,
      ...templateMessages,
    }
  }

  async load() {
    this.html = await this.loadTemplate()
    this.messages = this.loadMessages()
  }

  render(intl, variables: any) {
    const subject = intl.formatMessage(this.getSubject())

    const content = this.renderer.renderString(this.html, {
      ...variables,
      messages: this.messages,
      subject,
      intl,
    })

    return { content, subject }
  }
}
