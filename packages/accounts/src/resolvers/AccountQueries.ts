import { Query } from '@nestjs/graphql'
import { TradingAccess } from '@er/common'
import { Injectable } from '@nestjs/common'
import { Connection } from 'typeorm'
import { Account } from '../entities'

@Injectable()
export class AccountQueries {
  constructor(
    private readonly connection: Connection,
  ) {}

  @Query()
  @TradingAccess('profile', 'read')
  async me(request) {
    return this.connection.manager
      .createQueryBuilder()
      .select('account')
      .from(Account, 'account')
      .leftJoinAndSelect('account.user', 'user')
      .leftJoinAndSelect('account.role', 'role')
      .where('account."userId" = :userId', {userId: request.user.id})
      .getOne()
  }
}
