import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm'
import { AggregateRoot } from '@er/cqrs'

@Entity()
export class User extends AggregateRoot {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  login: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({
    default: false,
  })
  isVerified: boolean

  @Column({ default: 'email' })
  verifyMethod: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
