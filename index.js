const ExpressP2P = require('./express-p2p.js')

const peers = process.argv[2]

const options = {
  peers:peers.split()
}

const ep2p = new ExpressP2P(options)

//setInterval(() => { console.log(ep2p) }, 3000)

// ep2p.events.on(
//   'new_connection',
//   data => console.log(data)
// )
//
// ep2p.events.on(
//   'disconnec',
//   data => console.log(data)
// )
//
// ep2p.events.on(
//   'message',
//   data => console.log(data)
// )
