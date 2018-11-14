import { validate, ValidatorOptions } from 'class-validator'
import { plainToClass } from 'class-transformer'

const mapErrors = (result, error) => {
  if (error.children && error.children.length > 0) {
    return {
      ...result,
      [error.property]: error.children.reduce(mapErrors, {}),
    }
  }

  return {
    ...result,
    [error.property]: Object.values(error.constraints)[0] || '',
  }
}

interface ValidationOptions extends ValidatorOptions {
  target?: string
  transform?: boolean
}

export function Validate(metatype, options?: ValidationOptions): any {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const original = descriptor.value

    options = options || {}

    const { target: targetField = 'input', transform = true, ...validatorOptions } = options

    descriptor.value = async function(request, params, context, info) {
      try {
        const values = targetField ? params[targetField] : params

        const object = plainToClass(metatype, { ...values, user: context.user })

        const errors = await validate(object, validatorOptions)

        if (errors && errors.length > 0) {
          return { errors: errors.reduce(mapErrors, {}) }
        }

        const result = targetField && transform ? { ...params, [targetField]: object } : params

        return original.bind(this)(request, result, context, info)
      } catch (error) {
        console.log(error) // tslint:disable-line:no-console
        throw error
      }
    }

    return descriptor
  }
}
