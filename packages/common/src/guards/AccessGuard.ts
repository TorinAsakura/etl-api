import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AccessControl } from 'accesscontrol'
import { AccessDeniedException } from '../exceptions/AccessDeniedException'
import { UnauthorizedException } from '../exceptions/UnauthorizedException'
import { Connection } from 'typeorm'
import { Account } from '@er/accounts/src/entities'

interface WithAccessParams {
  resource: string
  action: string
  possession?: string
}

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly connection: Connection,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [, , ctx, request] = context.getArgs()

    const user = ctx.user || request.user

    const withAuthAccess = this.reflector.get('AuthAccess', context.getHandler())
    const withTradingAccess = this.reflector.get<WithAccessParams>('TradingAccess', context.getHandler())

    if ((withAuthAccess || withTradingAccess) && !user) {
      throw new UnauthorizedException()
    }

    if (withTradingAccess) {
      const account = await this.connection.manager
        .createQueryBuilder()
        .select('account')
        .from(Account, 'account')
        .leftJoinAndSelect('account.role', 'role')
        .where('account."userId" = :userId', { userId: user.id })
        .getOne()

      if (!(account && account.role)) {
        throw new AccessDeniedException()
      }

      const permissions = account.role.permissions.map(item => ({
        ...item,
        role: 'USER_PERMISSIONS',
        possession: 'any',
      }))

      let permission = null

      try {
        const ac = new AccessControl(permissions)

        permission = ac.permission({
          role: 'USER_PERMISSIONS',
          action: withTradingAccess.action,
          resource: withTradingAccess.resource,
          possession: withTradingAccess.possession || 'any',
        })
      } catch (error) {
        console.log(error) // tslint:disable-line:no-console

        throw new AccessDeniedException()
      }

      if (!(permission && permission.granted)) {
        throw new AccessDeniedException()
      }
    }

    return true
  }
}
