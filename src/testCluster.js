// @ts-check
const cluster = require('cluster')
const { cpus } = require('os')
const http = require('http')

const cpuArr = cpus()
const store = {}

let getPidNo = () => {
  const cpu = cpuArr[0]
  console.log('== cpuArr', cpuArr[0])
  return cluster.isPrimary
}

if (cluster.isPrimary) {
  console.log('=== cluster.isPrimary', cluster.isPrimary)
  console.log('=== cluster.isMaster', cluster.isMaster)
  cpuArr.forEach(() => cluster.fork())

  cluster.on('exit', (worker, code, signal) => {
    console.log('=== cluster exit code', code)
    console.log('=== cluster exit signal', signal)
  })

  console.log('=== cluster forked')
} else {
  const pid = process.pid
  const cpu = cpuArr[0]
  getPidNo = index => {
    const result = cpu.speed === 2400 ? 4 : 8
    console.log('=== pid', pid)
    return result
  }
  // http.createServer((req, res) => {
  //   console.log('Request received: ', pid)
  //   req.on('data', (chunk) => {
  //     console.log(`${pid} received data:`, chunk)
  //     store[pid] = store[pid] ? store[pid] + chunk : chunk
  //   })
  // }).listen(8081, () => {
  //   console.log('Server started: ', pid)
  // })

  console.log('Worker %d started', pid)
}

process.on('SIGINT', () => {
  console.log('Request received: ', process.pid)
})

process.on('exit', () => {
  console.log('Request exit: ', process.pid)
})

exports.getPidNo = getPidNo
