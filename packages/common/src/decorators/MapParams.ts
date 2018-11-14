import { plainToClass } from 'class-transformer'

export function MapParams(metatype): any {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const original = descriptor.value

    descriptor.value = function(request, params, context, info) {
      const object = plainToClass(metatype, params)

      return original.bind(this)(request, object, context, info)
    }

    return descriptor
  }
}
