import { defineMessages } from '@er/intl'

export default defineMessages({
  minLength: {
    id: 'api.account.min_length',
    defaultMessage: 'Минимально 3 символа',
  },
  loginExists: {
    id: 'api.account.login_exists',
    defaultMessage: 'Логин уже используется в системе',
  },
  emailExists: {
    id: 'api.account.email_exists',
    defaultMessage: 'Email уже используется в системе',
  },
  invalidEmail: {
    id: 'api.account.invalid_email',
    defaultMessage: 'Невалидный Email',
  },
  confirmPassword: {
    id: 'api.account.confirm_password',
    defaultMessage: 'Пароли не совпадают',
  },
})
