import { UserMutations } from './UserMutations'
import { UserQueries } from './UserQueries'

export { UserMutations } from './UserMutations'
export { UserQueries } from './UserQueries'

export const Resolvers = [
  UserMutations,
  UserQueries,
]
