import { Injectable } from '@nestjs/common'
import { Query } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities'
import { Repository } from 'typeorm'

@Injectable()
export class UserQueries {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
}
