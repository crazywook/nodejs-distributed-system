const { Kafka } = require('kafkajs')
const { setGracefulShutdown } = require('../utils')

function createKafkaTransporter({ clientId }) {
  const kafka = new Kafka({
    clientId,
    brokers: ['localhost:9092'],
    logLevel: 2,
  })

  const groupId = `${clientId}-group`
  const consumer = kafka.consumer({
    groupId,
  })

  consumer.on('consumer.crash', () => {
    console.log('=== consumer echo crash')
  })
  consumer.on('consumer.disconnect', () => {
    console.log('=== consumer echo disconnect')
  })
  consumer.on('consumer.connect', event => {
    console.log('=== consumer echo connect', event)
  })
  consumer.on('consumer.group_join', event => {
    console.log('=== consumer echo group_join', event)
  })
  consumer.on('consumer.rebalancing', event => {
    console.log('=== consumer echo rebalancing', event)
  })

  const producer = kafka.producer()
  producer.on('producer.disconnect', () => {
    console.log('=== producer echo disconnect')
  })
  producer.on('producer.connect', event => {
    console.log('=== producer echo connect', event)
  })

  setGracefulShutdown(consumer, { clientId })
  setGracefulShutdown(producer, { clientId })

  return { consumer, producer }
}
exports.createKafkaTransporter = createKafkaTransporter
