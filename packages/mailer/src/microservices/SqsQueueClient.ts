import * as crypto from 'crypto'
import * as Producer from 'sqs-producer'

export class SqsQueueClient {
  constructor(
    private readonly queueUrl: string,
    private readonly key: string,
    private readonly secret: string,
  ) {}

  async send(template, to, locale, variables) {
    const data = {
      pattern: { cmd: 'send' },
      data: {
        template,
        to,
        locale,
        variables,
      },
    }

    const body = JSON.stringify(data)

    const producer = Producer.create({
      queueUrl: this.queueUrl,
      accessKeyId: this.key,
      secretAccessKey: this.secret,
    })

    producer.send({
      body,
      id: crypto.createHash('md5').update(body).digest('hex'),
    }, (error) => {
      if (error) {
        console.log(error) // tslint:disable-line:no-console
      }
    })
  }
}
