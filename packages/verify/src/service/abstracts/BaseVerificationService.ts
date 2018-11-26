import { v4 as uuid } from 'uuid'
import { generatePassword } from '@er/common'
import { VerificationData } from '@er/verify'
import { Repository } from 'typeorm'

export interface VerificationParams {
  consumer: string
  template?: string
  payload?: string
}

export class BaseVerificationService {
  static getVerificationId(): string {
    return [uuid(), uuid()].join('').replace(/-/g, '')
  }
  static getVerificationCode(length: number = 6): string {
    return generatePassword(length)
  }

  constructor(
    protected verificationRepository: Repository<VerificationData>,
  ) {}

  async initiate(params: VerificationParams): Promise<VerificationData> {
    const verificationId = BaseVerificationService.getVerificationId()
    const code = BaseVerificationService.getVerificationCode()

    return this.verificationRepository.save(
      this.verificationRepository.create({
        consumer: params.consumer,
        payload: params.payload,
        verificationId,
        code,
      }),
    )
  }

  async validate(verificationId: string, code: string): Promise<any> {
    const verification = await this.verificationRepository.findOne({
      where: {
        verificationId,
        code,
      },
    })

    if (verification) {
      await this.verificationRepository.remove(verification)
      return {
        consumer: verification.consumer,
        payload: verification.payload,
      }
    }

    throw new Error('Not validate code')
  }

  async remove(verificationId: string) {
    return this.verificationRepository.delete({
      verificationId,
    })
  }
}
