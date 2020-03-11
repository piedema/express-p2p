const args = process.argv.splice(2)
const ExpressP2P = require('./express-p2p.js')

const myAddress = {
  host:args[0],
  port:args[1]
}

const expressP2P = new ExpressP2P(myAddress)

expressP2P.server.get('/message', (req, res) => {
  console.log('/message recieved', req.query)
  let message = `I, ${expressP2P.myAddress}, recieved your message successfully sir!`
  res.status(200).send(message)
})

let counter = 0
setInterval(() => {
  counter++
  expressP2P.peers.filter('345').forEach((address) => {
    expressP2P.client.get(address, '/message', { timestamp:Date.now(), message:`hallo new message #${counter}` }, (error, response) => {
      if(error) console.log('/message error:', error)
      if(response) console.log('/message response', response.body)
    })
  })
}, 5000)

console.log('my address', expressP2P.myAddress)
