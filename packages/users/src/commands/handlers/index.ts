import { InitiateUpdatePasswordHandler } from './InitiateUpdatePasswordHandler'
import { VerifyUpdatePasswordHandler } from './VerifyUpdatePasswordHandler'
import { InitiateResetPasswordHandler } from './InitiateResetPasswordHandler'
import { VerifyResetPasswordHandler } from './VerifyResetPasswordHandler'

export { InitiateUpdatePasswordHandler } from './InitiateUpdatePasswordHandler'
export { VerifyUpdatePasswordHandler } from './VerifyUpdatePasswordHandler'
export { InitiateResetPasswordHandler} from './InitiateResetPasswordHandler'
export { VerifyResetPasswordHandler } from './VerifyResetPasswordHandler'

export const CommandHandlers = [
  InitiateUpdatePasswordHandler,
  VerifyUpdatePasswordHandler,
  InitiateResetPasswordHandler,
  VerifyResetPasswordHandler,
]
