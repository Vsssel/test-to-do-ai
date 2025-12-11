import { Kafka } from "kafkajs"
import { emailQueue } from "./queue"

const kafka = new Kafka({
    clientId: 'email-service',
    brokers: ['localhost:9092'],
})

const consumer = kafka.consumer({ groupId: 'email-service' })

export async function startKafkaConsumer() {
    await consumer.connect()
    await consumer.subscribe({ topic: 'email-topic' })
    await consumer.run({
        eachMessage: async ({ message }) => {
            const data = JSON.parse(message.value?.toString() || '{}')
            await emailQueue.add('send-email', data, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000
                }
            })
            console.log(`Email sent to ${data.to}`)
        }
    })
}