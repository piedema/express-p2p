const args = process.argv.splice(2)
const ExpressP2P = require('./express-p2p.js')

const options = {
  port:args[0]
}

const expressP2P = new ExpressP2P(options)

;(function setupListener(){
  setTimeout(() => {
    if(expressP2P.isInit){
      expressP2P.server.get('/message', (req, res) => {
        console.log(req.query)
      })
    }
    if(!expressP2P.isInit) setTimeout(setupListener, 1000)
  }, 1000)
})()

;(function setupCaller(){
  setTimeout(() => {
    if(expressP2P.isInit){
      let counter = 0
      setInterval(() => {
        counter++
        expressP2P.client.newRequest('get', false, '/message', { timestamp:Date.now(), message:`hallo new message #${counter}` }, (error, response) => {
          if(error) console.log('/message error:', error)
          if(response) console.log('/message response', response.body)
        })
      }, 5000)
    }
    if(!expressP2P.isInit) setTimeout(setupCaller, 1000)
  }, 1000)
})()
