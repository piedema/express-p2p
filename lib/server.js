module.exports = (options, heartbeats, blacklist, whitelist) => {

  const app = require('express')()

  app.use(expressip().getIpInfoMiddleware)

  app.get('/message', (req, res) => {
    const address = req.query.address
    console.log('recieved message from', address)
    heartbeats.update(address)
    res.status(200).send('Message recieved.')
  })

  app.get('/heartbeat', (req, res) => {
    const address = req.query.address
    console.log('recieved heartbeat from', address)
    heartbeats.update(address)
    res.status(200).send('Heartbeat recieved.')
  })

  app.get('/connect', (req, res) => {
    const address = req.query.address
    console.log('new connect request from', address)
    if(options.blacklist && blacklist.get(address)) return
    if(options.whitelist && !whitelist.get(address)) return

    heartbeats.update(address)
    res.status(200).send('Accepted your connection request.')
  })

  app.listen(options.port, () => console.log(`Server listening on port ${options.port}.`))
}
