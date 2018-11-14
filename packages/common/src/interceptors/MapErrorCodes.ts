import { NestInterceptor, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import { IntlProvider } from '@er/intl'

export class MapErrorCodes implements NestInterceptor {
  private intlProvider = new IntlProvider()

  constructor() {
    this.intlProvider.load()
  }

  intlErrors(errors: any, locale: string) {
    const intl = this.intlProvider.create(locale)

    try {
      return Object.keys(errors).reduce((result, key) => ({
        ...result,
        [key]: errors[key] ? intl.formatMessage({ id: errors[key] }) : errors[key],
      }), {})
    } catch (error) {
      console.log(error) // tslint:disable-line:no-console

      return errors
    }
  }

  intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    return call$.pipe(map(data => {
      if (data && data.errors) {
        const request = context.switchToHttp().getRequest()

        return {
          ...data,
          errors: this.intlErrors(data.errors, request.locale),
        }
      }

      return data
    }))
  }
}
