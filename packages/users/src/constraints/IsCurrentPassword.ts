import {
  registerDecorator, ValidationOptions, ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from '../entities'

@ValidatorConstraint({ async: true })
export class IsCurrentPasswordConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validate(password: string, args: any) {
    try {
      const user = await this.userRepository.findOne({ where: { id: args.object.user.id } })

      if (!user) {
        return false
      }

      return await bcrypt.compare(password, user.password)
    } catch (error) {
      return false
    }
  }
}

export const IsCurrentPassword = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
        target: object.constructor,
        options: validationOptions,
        constraints: [],
        propertyName,
        validator: IsCurrentPasswordConstraint,
    })
  }
}
