//load package
const ExpressP2P = require('./express-p2p.js')

// initiate package
// host is your ip address, 127.0.0.1 or localhost for running locally or external ip for running over the web
// port is your port to acces the peer
const expressP2P = new ExpressP2P({
  host:'127.0.0.1',
  port:8080
})

//you can acces multiple functions after initiation

// for example emit message to other peers:
let counter = 0
expressP2P.peers.filter().forEach((address) => {
  let message = { timestamp:Date.now(), message:`hello, new message #${counter}` }
  counter++
  expressP2P.client.get(address, '/message', message, (error, response) => {
    if(error) console.log(error)
    console.log(response.body)
  })
})

// create message listener on server
expressP2P.server.get('/message', (req, res) => {
  console.log('I (server) recieved new message')
  let message = `I, ${expressP2P.myAddress}, recieved your message successfully sir!`
  res.status(200).send(message)
})

// get all connected peers
expressP2P.peers.filter().forEach((address) => {
  console.log(address)
})

// add a peer (or first peer to join a network)
expressP2P.peers.add("123.4.5.678:8080")

// remove a peer
expressP2P.peers.remove("123.4.5.678:8080")
