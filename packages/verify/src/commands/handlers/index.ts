import { CreateEmailVerificationCodeHandler } from './CreateEmailVerificationCodeHandler'
import { ConfirmVerificationCodeHandler} from './ConfirmVerificationCodeHandler'
import { Enable2faHandler } from './Enable2faHandler'
import { Enable2faVerifyHandler } from './Enable2faVerifyHandler'
import { VerifyHandler } from './VerifyHandler'
import { InitiateVerifyHandler } from './initiateVerifyHandler'

export const CommandHandlers = [
  CreateEmailVerificationCodeHandler,
  ConfirmVerificationCodeHandler,
  Enable2faHandler,
  Enable2faVerifyHandler,
  VerifyHandler,
  InitiateVerifyHandler,
]
