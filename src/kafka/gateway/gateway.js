// @ts-check
const http = require('http')
const qs = require('qs')
const debuglog = require('util').debuglog('gateway')

/** @type {Record<string, { handler: (payload: any) => Promise<any> }>} */
const routers = {}

function createGatewayServer(config = {}) {
  const { name } = config

  const server = http.createServer(requestHandler)

  server.on('error', (req, res) => {
    console.error('=== http server error', req.url)
  })
  server.on('close', () => {
    console.log(`=== http server(${name}) close`)
  })

  console.log('=== createGatewayServer:', name)
  return server
}

async function requestHandler(req, res) {
  const method = req.method
  const url = req.url

  const routerKey = `${method} ${url.split('?')[0]}`
  debuglog('requested', routerKey)
  const router = routers[routerKey]

  if (!router) {
    res.statusCode = 404
    res.write(`not found ${routerKey}`)
    res.end()
    return
  }

  switch (method) {
    case 'GET':
      const queryString = req.url?.split('?')[1]
      const payload = qs.parse(queryString)

      debuglog('payload', payload)
      const result = await router.handler(payload)
      res.write(String(result))
      break
    case 'POST':
      req.on('data', chunk => {
        debuglog('payload', chunk.toString())
        res.write('POST')
      })
      break
    default:
      res.statusCode = 400
      res.write('not support method')
  }

  res.end()
}

function route(path, handler) {
  routers[path] = {
    handler,
  }
}

exports.createGatewayServer = createGatewayServer
exports.route = route
