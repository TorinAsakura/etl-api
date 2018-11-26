import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { AggregateRoot } from '@er/cqrs'

@Entity()
export class VerificationData extends AggregateRoot {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  verificationId: string

  @Column()
  code: string

  @Column()
  consumer: string

  @Column({ nullable: true })
  payload?: string

  @Column({ nullable: true })
  totpUri?: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
