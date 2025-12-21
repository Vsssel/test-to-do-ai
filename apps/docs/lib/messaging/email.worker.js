import { Worker } from 'bullmq'
import {redis} from './redis.js'
import { sendEmail } from './email.sender.js'

new Worker(
  'email-queue',
  async job => {
    console.log('Отправляю письмо:', job.data)

    await sendEmail(job.data)
  },
  { connection: redis }
)
