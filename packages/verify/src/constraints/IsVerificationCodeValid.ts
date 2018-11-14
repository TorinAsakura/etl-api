import {
  registerDecorator, ValidationOptions,
  ValidatorConstraint, ValidatorConstraintInterface,
} from 'class-validator'
import { Verification } from '../entities'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@ValidatorConstraint({ async: false })
export class IsVerificationCodeValidConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
  ) {}
  async validate(verificationCode: string, args: any) {
    const { verificationId } =  args.object

    const verification = await this.verificationRepository.findOne({
      where: {
        verificationCode,
        verificationId,
      },
    })

    return !!verification
  }
}

export const IsVerificationCodeValid = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      options: validationOptions,
      constraints: [],
      propertyName,
      validator: IsVerificationCodeValidConstraint,
    })
  }
}
