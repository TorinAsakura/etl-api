import { SqsQueueClient } from './microservices/SqsQueueClient'

const createClient = (host = 'mq', channel = 'mailer') =>
  new SqsQueueClient(process.env.MAILER_QUEUE_URL, process.env.MAILER_QUEUE_KEY, process.env.MAILER_QUEUE_SECRET)

export {
  createClient,
}
