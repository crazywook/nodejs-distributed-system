// @ts-check
const { route } = require('../gateway')

exports.routeTest = function routeTest() {
  route('GET /test', async () => {
    return 'success'
  })
}
