const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'distributes',
  brokers: ['localhost:9092'],
})

const producer = kafka.producer()
producer.connect()

exports.producer = producer
