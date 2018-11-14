import * as path from 'path'
import * as glob from 'glob-promise'
import { Intl } from './Intl'

export class IntlProvider {
  private locales = new Map()

  async load() {
    const filePaths = await glob(path.join(process.cwd(), 'locales/**.json'))

    filePaths.forEach(filePath => {
      const locale = path.basename(filePath, '.json')
      const content = require(filePath)

      this.locales.set(locale, content)
    })
  }

  create(locale: string) {
    const messages = this.locales.get(locale) || {}

    return new Intl(locale, messages)
  }
}
