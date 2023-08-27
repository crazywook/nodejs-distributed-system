/// <reference path="../../node_modules/@types/node/cluster.d.ts" />
// @ts-check
// /** @type {import('cluster').default} */
const cluster = require('cluster')
const fs = require('fs')

const logFilePath = './log.txt'

const http = require('http')

if (cluster.isPrimary) {
  const result = [1, 2, 3].map((cpu, i) => {
    const worker = cluster.fork({ index: i })
    return {
      id: worker.id,
      pid: worker.process.pid,
    }
  })

  cluster.on('exit', (worker, code, signal) => {
    console.log('=== cluster exit worker', worker.id)
    console.log('=== cluster exit code', code)
    console.log('=== cluster exit signal', signal)

    fs.writeFileSync(logFilePath, `${worker.id} /  ${worker.process.pid} / ${code} / ${signal}`)
  })

  console.log('=== cluster forked', result)
} else {
  const pid = process.pid

  const server = http
    .createServer((req, res) => {
      console.log('=== req.method', req.method)
      switch (req.method) {
        case 'GET':
          const queryString = req.url?.split('?')[1]
          res.write(queryString)
          res.end()
          break
        case 'POST':
          res.write('POST')
          req.on('data', (chunk) => {
            console.log(`${pid} received data:`, chunk.toString())
          })
          break
        default:
          res.statusCode = 400
          res.write('default')
          res.end()
          return
      }

      req.on('end', (...args) => {
        console.log(`${pid} received end`)
        console.log('=== args', args)
        res.write('success')
        res.end()
      })
    })
    .listen(8081, () => {
      console.log('Server started: ', pid)
    })

  process.on('SIGINT', (...arg) => {
    console.log('=== SIGINT', arg)
    console.log('Request received: ', pid)
    process.exit(1)
  })

  process.on('exit', () => {
    console.log('Request exit: ', pid)
  })
}
