import { createTransport, Transporter } from 'nodemailer'

export class Transport {
  private transport: Transporter

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.transport = createTransport({
        service: 'yandex',
        auth: {
          user: 'etelaranta.net@yandex.ru',
          pass: 'WRytzyedRk3RTRReFKtHiFoHUuqa3LygfuFLHfY4KiK4ntpfktCVvC',
        },
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
