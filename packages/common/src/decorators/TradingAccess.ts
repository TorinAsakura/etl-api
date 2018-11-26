import { ReflectMetadata } from '@nestjs/common'

export const TradingAccess = (resource, action) => ReflectMetadata('TradingAccess', { resource, action })
