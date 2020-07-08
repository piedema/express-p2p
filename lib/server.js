module.exports = (options, heartbeats, blacklist, whitelist) => {

  const app = require('express')()
  const requestIp = require('request-ip')

  app.use(requestIp.mw())

  app.get('/message', (req, res) => {
    const ip = req.clientIp
    console.log('recieved message from', ip)
    heartbeats.update(ip)
    res.status(200).send('Message recieved.')
  })

  app.get('/heartbeat', (req, res) => {
    const ip = req.clientIp
    console.log('recieved heartbeat from', ip)
    heartbeats.update(ip)
    res.status(200).send('Heartbeat recieved.')
  })

  app.get('/connect', (req, res) => {
    const ip = req.clientIp
    console.log('new connect request from', ip)
    if(options.blacklist && blacklist.get(ip)) return
    if(options.whitelist && !whitelist.get(ip)) return

    heartbeats.update(ip)
    res.status(200).send('Accepted your connection request.')
  })

  app.listen(options.port, () => console.log(`Server listening on port ${options.port}.`))
}
