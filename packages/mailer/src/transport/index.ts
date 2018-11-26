import { createTransport, Transporter } from 'nodemailer'
import * as mg from 'nodemailer-mailgun-transport'

export class Transport {
  private transport: Transporter

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      const auth = {
        auth: {
          api_key: 'key-9d9609e9571e1dffdb4901be18758a6c',
          domain: 'etelaranta.net',
        },
      }
      this.transport = createTransport(mg(auth))
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
