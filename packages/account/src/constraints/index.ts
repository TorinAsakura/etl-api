import { IsEmailExistsConstraint } from './IsEmailExists'
import { IsLoginExistsConstraint } from './IsLoginExists'

export { IsEmailExists } from './IsEmailExists'
export { IsLoginExists } from './IsLoginExists'

export const Constraints = [
  IsEmailExistsConstraint,
  IsLoginExistsConstraint,
]
