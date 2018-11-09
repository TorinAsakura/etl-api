import { Transform } from 'class-transformer'
import { normalizePhone } from '@er/common'

export class LoginDto {
  @Transform(normalizePhone)
  readonly phone: string

  readonly password: string
}
