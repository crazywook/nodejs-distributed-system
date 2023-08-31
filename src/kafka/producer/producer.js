const { Kafka } = require('kafkajs')
const { setGracefulShutdown } = require('../utils')

const clientId = 'kafka-producer'

const kafka = new Kafka({
  clientId,
  brokers: ['localhost:9092'],
})

const producer = kafka.producer()
producer.on('producer.connect', event => {
  console.log('=== producer connect', event)
})

setGracefulShutdown(producer, { clientId })

exports.producer = producer
