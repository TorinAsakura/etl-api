import { IsEmailExistsConstraint } from './IsEmailExists'
import { IsFieldEqualConstraint } from './IsFieldEqual'
import { IsCurrentPasswordConstraint } from './IsCurrentPassword'

export { IsEmailExists } from './IsEmailExists'
export { IsFieldEqual } from './IsFieldEqual'
export { IsCurrentPassword } from './IsCurrentPassword'

export const Constraints = [
  IsEmailExistsConstraint,
  IsFieldEqualConstraint,
  IsCurrentPasswordConstraint,
]
