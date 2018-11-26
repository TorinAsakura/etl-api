import {
  registerDecorator, ValidationOptions, ValidationArguments,
  ValidatorConstraint, ValidatorConstraintInterface,
} from 'class-validator'
import { Connection } from 'typeorm'
import { VerificationData } from '@er/verify'

@ValidatorConstraint({ async: false })
export class IsValidCodeConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly connection: Connection,
  ) {}

  async validate(value: string, args: ValidationArguments) {
    const { verificationId, code } = args.object as any
    const verificationData = await this.connection.manager.findOne(VerificationData, {
      where: {
        verificationId,
        code,
      },
    })
    return !!verificationData
  }
}

export const IsValidCode = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      options: validationOptions,
      constraints: [],
      propertyName,
      validator: IsValidCodeConstraint,
    })
  }
}
