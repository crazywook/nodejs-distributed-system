// @ts-check
const { expect } = require('chai')
const supertest = require('supertest')
const debuglog = require('util').debuglog('test')

const { createGatewayServer } = require('../../src/kafka/gateway/gateway')
const { routeEcho } = require('../../src/kafka/gateway/router/echo')
const { bootEcho } = require('../../src/kafka/consumer/echo')
const { createKafkaTransporter } = require('../../src/kafka/factory')

/**
 * @typedef {{
 *    consumer: import('kafkajs').Consumer
 *    producer: import('kafkajs').Producer
 *  }} KafkaTransporter
 */

describe('Gateway Kafka echo', () => {
  const TEST_PREFIX = 'TEST_GATEWAY_ECHO'

  /** @type {supertest.SuperTest<supertest.Test>} */
  let request
  /** @type {import('http').Server}  */
  let gatewayServer
  /** @type {import('kafkajs').Consumer} */
  let consumer

  /**
   *  @type {KafkaTransporter}
   */
  let kafkaForEchoService
  /**
   *  @type {KafkaTransporter}
   */
  let kafkaForGateway

  before(async function () {
    this.timeout(1000 * 30)
    console.time('create-server')
    kafkaForEchoService = createKafkaTransporter({ clientId: 'test-echo' })
    kafkaForGateway = createKafkaTransporter({ clientId: 'test-gateway' })

    gatewayServer = createGatewayServer({ name: 'kafka test' })

    request = supertest(gatewayServer)
    console.timeEnd('create-server')
    console.time('boot-service')
    await Promise.all([bootEcho(kafkaForEchoService), routeEcho(kafkaForGateway)])
    console.timeEnd('boot-service')
  })

  after(done => {
    const connectionCount = gatewayServer.connections

    if (connectionCount > 0) {
      gatewayServer.close(err => {
        debuglog('gatewayServer closed', TEST_PREFIX, err)
        done()
      })
    } else {
      done()
    }
  })

  it('에코 라우터 등록후 응답 200확인', async () => {
    const message = 'hello'

    const response = await request.get(`/echo?message=${message}`)

    debuglog('response.text', response.text)

    expect(response.status).to.be.equal(200)
    expect(response.text).to.be.equal(`echo:${message}`)
  }).timeout(1000 * 15)
}).timeout(1000 * 15)
