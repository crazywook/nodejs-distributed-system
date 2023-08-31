const { expect } = require('chai')
const supertest = require('supertest')
const { createGatewayServer } = require('../../src/kafka/gateway/gateway')
const { routeTest } = require('../../src/kafka/gateway/router/test')

describe('Gateway Server', () => {
  /** @type {supertest.SuperTest<supertest.Test>} */
  let request
  /** @type {import('http').Server}  */
  let gatewayServer

  before(async () => {
    gatewayServer = createGatewayServer({ name: 'gateway-server' })
    request = supertest(gatewayServer)
  })

  after(done => {
    const connectionCount = gatewayServer.connections

    if (connectionCount > 0) {
      gatewayServer.close(err => {
        console.log('=== gatewayServer closed', err)
        done()
      })
    } else {
      done()
    }
  })

  it('서버 응답 404 확인', async () => {
    const response = await request.get('/test')
    expect(response.status).to.be.equal(404)
  }).timeout(1000 * 100)

  it('라우터 등록후 응답 200확인', async () => {
    routeTest()

    const response = await request.get('/test')
    expect(response.status).to.be.equal(200)
  }).timeout(1000 * 100)
}).timeout(1000 * 100)
