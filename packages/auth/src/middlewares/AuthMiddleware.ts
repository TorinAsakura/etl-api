import { Injectable, NestMiddleware } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import { User } from '@er/users'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  resolve() {
    return async (req, res, next) => {
      const token = req.headers.authorization

      if (!token) {
        return next()
      }

      try {
        const payload: any = this.jwtService.verify(token)

        if (payload) {
          const user = await this.userRepository.findOne({ where: { id: payload.id } })

          if (user) {
            req.user = user
          }
        }
      } catch (error) {
        console.log(error) // tslint:disable-line:no-console
      }

      return next()
    }
 }
}
