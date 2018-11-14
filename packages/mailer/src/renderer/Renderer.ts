import * as path from 'path'
import * as glob from 'glob-promise'
import * as edge from 'edge.js'
import Template from './Template'

export class Renderer {
  private templates = new Map()
  private renderer = edge.share({
    assetsUrl: process.env.ASSETS_URL,
  })

  async load() {
    const dirs = await glob(path.join(__dirname, '../templates/*/'))
    const templateDirs = dirs.filter((dirPath) => !dirPath.includes('includes'))

    await Promise.all(templateDirs.map(async (templateDir) => {
      const template = new Template(templateDir, this.renderer)
      await template.load()

      this.templates.set(template.getName(), template)
    }))
  }

  getTemplate(templateName: string) {
    return this.templates.get(templateName)
  }
}
