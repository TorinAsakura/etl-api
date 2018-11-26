import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { AggregateRoot } from '@er/cqrs'
import { TradingRole} from '@er/roles'
import { User } from '@er/users'

@Entity()
export class Account extends AggregateRoot {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => TradingRole)
  @JoinColumn()
  role: TradingRole

  @OneToOne(type => User)
  @JoinColumn()
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  get login() {
    if (this.user) {
      return this.user.login
    }
  }

  get email() {
    if (this.user) {
      return this.user.email
    }
  }
}
