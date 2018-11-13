import * as Consumer from 'sqs-consumer'
import { Server, CustomTransportStrategy } from '@nestjs/microservices'
import * as AWS from 'aws-sdk'

export interface SqsQueueServerConfig {
  url: string
  key: string
  secret: string
  region: string
}

export class SqsQueueServer extends Server implements CustomTransportStrategy {
  private server: Consumer = null

  constructor(
    private readonly config: SqsQueueServerConfig,
  ) {
    super()
  }

  public async listen(callback: () => void) {
    AWS.config.update({
      region: this.config.region,
      accessKeyId: this.config.key,
      secretAccessKey: this.config.secret,
    })

    this.server = Consumer.create({
      queueUrl: this.config.url,
      sqs: new AWS.SQS({ }),
      handleMessage: this.handleMessage.bind(this),
    })

    this.server.start()
  }

  public close() {
    this.server.stop()
  }

  private async handleMessage(message, done) {
    try {
      const messageObj = JSON.parse(message.Body)

      const pattern = JSON.stringify(messageObj.pattern)

      if (!this.messageHandlers[pattern]) {
        return
      }

      const handler = this.messageHandlers[pattern]

      await handler(messageObj.data)

      done()
    } catch (error) {
      console.log(error) // tslint:disable-line:no-console
    }
  }
}
