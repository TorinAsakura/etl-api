import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm'
import { AggregateRoot } from '@er/cqrs'

@Entity()
export class User extends AggregateRoot {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  login: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({
    default: false,
  })
  isVerified: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
