import {
  registerDecorator, ValidationOptions,
  ValidatorConstraint, ValidatorConstraintInterface,
} from 'class-validator'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@er/users'

@ValidatorConstraint({ async: false })
export class IsLoginExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validate(login: string) {
    const user = await this.userRepository.findOne({
      where: {login},
    })

    return !user
  }
}

export const IsLoginExists = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      options: validationOptions,
      constraints: [],
      propertyName,
      validator: IsLoginExistsConstraint,
    })
  }
}
