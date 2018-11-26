import { Injectable } from '@nestjs/common'
import { Query } from '@nestjs/graphql'
import { AuthAccess } from '@er/common'

@Injectable()
export class UserQueries {
  @Query()
  @AuthAccess()
  me(request) {
    return Promise.resolve(request.user)
  }
}
