import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from 'typeorm'
import { AggregateRoot } from '@er/cqrs'

export interface Permission {
  resource: string,
  action: string
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Role extends AggregateRoot {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('jsonb', { default: [], nullable: true })
  permissions: Permission[] = []

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
