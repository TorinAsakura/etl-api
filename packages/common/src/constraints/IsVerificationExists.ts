import {
  registerDecorator, ValidationOptions,
  ValidatorConstraint, ValidatorConstraintInterface,
} from 'class-validator'
import { Connection } from 'typeorm'
import { VerificationData } from '@er/verify'

@ValidatorConstraint({ async: false })
export class IsVerificationExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly connection: Connection,
  ) {}

  async validate(verificationId: string) {
    const verificationData = await this.connection.manager.findOne(VerificationData, {
      where: { verificationId },
    })

    return !!verificationData
  }
}

export const IsVerificationExists = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      options: validationOptions,
      constraints: [],
      propertyName,
      validator: IsVerificationExistsConstraint,
    })
  }
}
