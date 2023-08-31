// @ts-check
const debuglog = require('util').debuglog('echo:boot')

async function bootEcho({ consumer, producer }) {
  debuglog('boot echo')
  console.time('boot-echo')
  await producer.connect()
  await consumer.connect()
  await consumer.subscribe({
    topic: 'ECHO_REQUEST',
    fromBeginning: true,
  })

  debuglog('subscribed')

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const messageValue = message.value?.toString() ?? ''
      debuglog(
        JSON.stringify({
          partition,
          offset: message.offset,
          value: messageValue,
        }),
      )

      producer
        .send({
          topic: 'ECHO_RESPONSE',
          messages: [{ value: messageValue }],
        })
        .then(r => {
          debuglog('producer send', r)
        })
    },
  })

  console.timeEnd('boot-echo')
  debuglog('completed')
}

exports.bootEcho = bootEcho
