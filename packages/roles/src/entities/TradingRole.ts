import { ChildEntity } from 'typeorm'
import { Role } from './'

@ChildEntity('trading')
export class TradingRole extends Role {}
