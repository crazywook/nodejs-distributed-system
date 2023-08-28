const { Kafka } = require('kafkajs')

const PROCESS_PID = process.pid
const clientId = process.env.clientId || 'my-app'

console.log('=== start kafka clientId:', clientId, 'consumer pid:', PROCESS_PID)

const kafka = new Kafka({
  clientId,
  brokers: ['localhost:9092'],
  logLevel: 5,
})

const consumer = kafka.consumer({
  groupId: 'test-group',
  sessionTimeout: 30000,
  heartbeatInterval: 10000,
})

const run = async () => {
  await connectAndSubscribe()

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('=== pid', PROCESS_PID)
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

async function connectAndSubscribe() {
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: false })

  consumer.on('consumer.crash', () => {
    console.log('=== consumer crash')
    // consumer.start()
  })
  consumer.on('consumer.disconnect', () => {
    console.log('=== consumer disconnect')
  })
  consumer.on('consumer.connect', (event) => {
    console.log('=== consumer connect', event)
  })
  consumer.on('consumer.group_join', (event) => {
    console.log('=== consumer group_join', event)
  })
  consumer.on('consumer.rebalancing', (event) => {
    console.log('=== consumer rebalancing', event)
  })
}

run().catch(console.error)
