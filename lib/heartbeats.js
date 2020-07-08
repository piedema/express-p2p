module.exports = (options, peers) => {

  const needle = require('needle')

  const data = {}

  const removeInterval = setInterval(() => {
    peers.getAllPeers().forEach(address => {
      if(data[address] && data[address] < Date.now() - options.autoRemoveInterval){
        peers.remove(address)
      }
    })
  }, options.autoRemoveInterval)

  const updateInterval = setInterval (() => {
    peers.getAllPeers().forEach(address => {
      if(data[address]){
        needle.get(address + `/heartbeat&address=${options.myAddress}`, function(error, response) {
          if(error) peers.remove(address)
          if(!error && response.statusCode == 200) update(address)
        })
      }
    })
  }, options.heartbeatInterval)

  function get(address){
    if(!address) return data
    if(data[address]) return data[address]
    return false
  }

  function update(address){
    data[address] = Date.now()
  }

  return {

    get:get,

    update:update
  }
}
