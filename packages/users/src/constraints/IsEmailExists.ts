import {
  registerDecorator, ValidationOptions,
  ValidatorConstraint, ValidatorConstraintInterface,
} from 'class-validator'
import { Connection } from 'typeorm'
import { User } from '@er/users'

@ValidatorConstraint({ async: false })
export class IsEmailExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    private readonly connection: Connection,
  ) {}

  async validate(email: string) {
    const user = await this.connection.manager.findOne(User, {
      where: { email },
    })

    return !!user
  }
}

export const IsEmailExists = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      options: validationOptions,
      constraints: [],
      propertyName,
      validator: IsEmailExistsConstraint,
    })
  }
}
