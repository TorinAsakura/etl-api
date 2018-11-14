import {
  registerDecorator, ValidationOptions,
  ValidatorConstraint, ValidatorConstraintInterface,
} from 'class-validator'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@er/users'

@ValidatorConstraint({ async: false })
export class IsEmailExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validate(email: string) {
    const user = await this.userRepository.findOne({
      where: {email},
    })

    return !user
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
