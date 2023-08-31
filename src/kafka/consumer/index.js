const { Kafka } = require('kafkajs')

const client = new Kafka({
  clientId: 'gateway',
  brokers: ['localhost:9092'],
  logLevel: 5,
})

exports.kafkaClient = client
