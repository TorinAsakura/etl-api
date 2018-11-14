import { Module, Global } from '@nestjs/common'
import { GlobalPubSub } from '@er/cqrs'

@Global()
@Module({
  providers: [
    GlobalPubSub,
  ],
  exports: [
    GlobalPubSub,
  ],
})
export class CoreModule {}
