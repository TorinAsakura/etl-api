import { createTransport, Transporter } from 'nodemailer'
import * as AWS from 'aws-sdk'

export class Transport {
  private transport: Transporter

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      AWS.config.update({
        region: process.env.SES_REGION,
        accessKeyId: process.env.SES_KEY,
        secretAccessKey: process.env.SES_SECRET,
      })

      this.transport = createTransport({
        SES: new AWS.SES({
          apiVersion: '2010-12-01',
        }),
      })
    } else {
      this.transport = createTransport({
        host: 'mailhog',
        port: 1025,
        secure: false,
        auth: {
          user: 'user',
          pass: 'pass',
        },
      })
    }
  }

  send(to, subject, html) {
    return new Promise((resolve, reject) => {
      this.transport.sendMail({
        to,
        subject,
        from: process.env.SENDER || 'no-reply@demo.com',
        text: '<empty>',
        html,
      }, (error, info) => {
        if (error) {
          return reject(error)
        }

        resolve(info)
      })
    })
  }
}
