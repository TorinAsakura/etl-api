import { CreateEmailVerificationCodeHandler } from './CreateEmailVerificationCodeHandler'
import { ConfirmVerificationCodeHandler} from './ConfirmVerificationCodeHandler'

export const CommandHandlers = [
  CreateEmailVerificationCodeHandler,
  ConfirmVerificationCodeHandler,
]
