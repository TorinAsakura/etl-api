import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { User } from '@er/users'
import { AggregateRoot } from '@er/cqrs'

@Entity()
export class Verification extends AggregateRoot {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  verificationId: string

  @Column()
  verificationCode: string

  @ManyToOne((type) => User)
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
