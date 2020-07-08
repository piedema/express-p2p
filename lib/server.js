module.exports = (options, heartbeats, blacklist, whitelist) => {

  const app = require('express')()

  app.get('/message', (req, res) => {
    console.log('recieved message from', req.query.address)
    heartbeats.update(req.query.address)
    res.status(200).send('Message recieved.')
  })

  app.get('/heartbeat', (req, res) => {
    console.log('recieved heartbeat from', req.query.address)
    heartbeats.update(req.query.address)
    res.status(200).send('Heartbeat recieved.')
  })

  app.get('/connect', (req, res) => {
    console.log('new connect request from', req.query.address)
    if(options.blacklist && blacklist.get(req.query.address)) return
    if(options.whitelist && !whitelist.get(req.query.address)) return

    heartbeats.update(req.query.address)
    res.status(200).send('Accepted your connection request.')
  })

  app.listen(options.port, () => console.log(`Server listening on port ${options.port}.`))
}
