import * as crypto from 'crypto'

const pool = '0123456789'

const randomNumber = max => crypto.randomBytes(1)[0] % max

export const generatePassword = (length = 6) =>
  Array.from(Array(length).keys()).map(_ => pool[randomNumber(pool.length)]).join('')
