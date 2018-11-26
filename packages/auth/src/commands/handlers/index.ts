import { GenerateTokenHandler } from './GenerateTokenHandler'
import { VerifyAndGenerateTokenHandler } from './VerifyAndGenerateTokenHandler'
import { SigninHandler } from './SigninHandler'

export const CommandHandlers = [
  GenerateTokenHandler,
  VerifyAndGenerateTokenHandler,
  SigninHandler,
]
