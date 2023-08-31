const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'gateway-producer',
  brokers: ['localhost:9092'],
})

const producer = kafka.producer()

exports.gatewayProducer = producer
