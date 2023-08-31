const { createGatewayServer } = require('./gateway/gateway')

try {
  createGatewayServer().listen(8081, () => {
    console.log('Server started: ')
  })
} catch (error) {
  console.log('=== error', error)
}
