import { BaseVerificationService, VerificationParams } from './abstracts'
import { Repository } from 'typeorm'
import { AuthenticatorSecret, VerificationData } from '../entities'
import * as authenticator from 'authenticator'

export class AuthenticatorVerificationService extends BaseVerificationService {
  constructor(
    protected verificationRepository: Repository<VerificationData>,
    protected authenticatorSecretRepository: Repository<AuthenticatorSecret>,
  ) {
    super(verificationRepository)
  }

  async initiate(params: VerificationParams): Promise<any> {
    const result: any = await super.initiate(params)

    let secret = await this.getSecret(params.consumer)

    if (!secret || !secret.verified) {
      secret = await this.generateAndStoreSecret(params.consumer)
      result.totpUri = authenticator.generateTotpUri(secret.secret, params.consumer, 'company', 'SHA1', 6, 30)
      result.secret = secret.secret
    }

    return result
  }

  async validate(verificationId: string, code: string) {
    const verification = await this.verificationRepository.findOne({
      where: {
        verificationId,
      },
    })

    if (!verification) {
      throw new Error('Verification is not found')
    }

    const secret = await this.getSecret(verification.consumer)

    if (!secret) {
      throw new Error('User secret is not found')
    }

    const result = authenticator.verifyToken(secret.secret, code)

    if (result === null) {
      return {
        isValid: false,
        consumer: verification.consumer,
      }
    }

    if (!secret.verified && result) {
      await this.verifyAndSaveSecret(secret)
    }

    await this.remove(verificationId)

    return {
      isValid: true,
      consumer: verification.consumer,
    }
  }

  private async generateAndStoreSecret(consumer: string): Promise<AuthenticatorSecret> {
    await this.removeSecret(consumer)
    return this.authenticatorSecretRepository.save(
      this.authenticatorSecretRepository.create({
        secret: authenticator.generateKey(),
        verified: false,
        consumer,
      }),
    )
  }

  private async removeSecret(consumer: string) {
    return this.authenticatorSecretRepository.delete({
      consumer,
    })
  }

  private async verifyAndSaveSecret(secret: AuthenticatorSecret) {
    secret.verified = true
    return this.authenticatorSecretRepository.save(secret)
  }

  private async getSecret(consumer) {
    return this.authenticatorSecretRepository.findOne({
      where: {
        consumer,
      },
    })
  }
}
