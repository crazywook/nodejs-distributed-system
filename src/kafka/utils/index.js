/**
 * @param {import('kafkajs/types').Consumer |
 *  import('kafkajs/types').Producer} consumerOrProducer
 *  consumer:
 *  producer:
 * }}
 */
function setGracefulShutdown(consumerOrProducer, options = {}) {
  const errorTypes = ['unhandledRejection', 'uncaughtException']
  const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

  const clientId = options.clientId

  errorTypes.forEach(type => {
    process.on(type, async e => {
      try {
        console.log(`clientId: ${clientId} process.on ${type}`)
        console.error(e)
        await consumerOrProducer?.disconnect()
        process.exit(0)
      } catch (_) {
        process.exit(1)
      }
    })
  })

  signalTraps.forEach(type => {
    process.once(type, async () => {
      try {
        console.log(`clientId: ${clientId} will disconnect`)
        await consumerOrProducer?.disconnect()
      } finally {
        process.kill(process.pid, type)
      }
    })
  })
}
exports.setGracefulShutdown = setGracefulShutdown
