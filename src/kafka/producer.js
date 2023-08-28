const { Kafka } = require('kafkajs')

const PROCESS_PID = process.pid

const kafka = new Kafka({
  clientId: 'distributes',
  brokers: ['localhost:9092'],
})

async function run() {
  const producer = kafka.producer()
  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [{ value: 'Hello KafkaJS user!' }],
  })
}

run()
  .then(() => {
    console.log('=== end kafka producer pid', PROCESS_PID)
    process.exit(0)
  })
  .catch(console.error)
