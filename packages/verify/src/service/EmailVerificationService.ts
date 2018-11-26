import { BaseVerificationService, VerificationParams } from './abstracts'
import { createClient } from '@er/mailer/src/client'
import { VerificationData } from '@er/verify'
import { Repository } from 'typeorm'

export class EmailVerificationService extends BaseVerificationService {
  constructor(
    verificationRepository: Repository<VerificationData>,
  ) {
    super(verificationRepository)
  }

  async initiate(params: VerificationParams): Promise<VerificationData> {
    const verificationData = await super.initiate(params)

    const client = createClient()
    client.send('verification-code', params.consumer, 'en', {
      verificationId: verificationData.verificationId,
      verificationCode: verificationData.code,
    })
    return verificationData
  }

  async validate(verificationId: string, code: string) {
    const verification = await super.validate(verificationId, code)

    return {
      isValid: true,
      consumer: verification.consumer,
    }
  }
}
