// @ts-check
const debuglog = require('util').debuglog('route:echo')
const { route } = require('../gateway')

exports.routeEcho = async function routeEcho(
  /** @type {import('../../../../test/gateway/gateway-kafka.spec').KafkaTransporter} */ {
    consumer,
    producer,
  },
) {
  await producer.connect()
  await consumer.connect()

  route('GET /echo', async payload => {
    if (!payload.message) {
      return 'message is required'
    }

    producer
      .send({
        topic: 'ECHO_REQUEST',
        messages: [
          {
            value: payload.message,
          },
        ],
      })
      .then(records => {
        debuglog('send records', records)
      })

    await consumer.subscribe({
      topic: 'ECHO_RESPONSE',
      fromBeginning: true,
    })

    debuglog('=== subscribe ECHO_RESPONSE')

    const result = await new Promise((resolve, _reject) => {
      consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const messageValue = message.value?.toString() ?? ''
          debuglog('eachMessage', {
            partition,
            offset: message.offset,
            value: messageValue,
          })
          resolve(`echo:${messageValue}`)
        },
      })
    })

    return result
  })

  debuglog('=== routeEcho finished')
}
