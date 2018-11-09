import { Injectable, NestMiddleware } from '@nestjs/common'
import { Locales } from 'locale'

@Injectable()
export class LocaleMiddleware implements NestMiddleware {
  resolve(locales = []) {
    return async (req, res, next) => {
      const supported = new Locales(locales)
      const { normalized } = (new Locales(req.headers['accept-language'])).best(supported)

      req.locale = normalized || locales[0]

      return next()
    }
 }
}
