import { Injectable } from '@nestjs/common'
import { VerificationMethod } from '../enums'
import { EmailVerificationService, AuthenticatorVerificationService } from './'
import { AuthenticatorSecret, VerificationData } from '../entities'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class VerificationServiceFactory {
  constructor(
    @InjectRepository(VerificationData)
    private readonly verificationRepository: Repository<VerificationData>,
    @InjectRepository(AuthenticatorSecret)
    private readonly authenticatorSecretRepository: Repository<AuthenticatorSecret>,
  ) {}

  create(method: VerificationMethod) {
    switch (method) {
      case VerificationMethod.Email:
        return new EmailVerificationService(this.verificationRepository)
      case VerificationMethod.Authenticator:
        return new AuthenticatorVerificationService(this.verificationRepository, this.authenticatorSecretRepository)
    }
  }
}
