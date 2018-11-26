import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class AuthenticatorSecret {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  consumer: string

  @Column()
  secret: string

  @Column()
  verified: boolean
}
