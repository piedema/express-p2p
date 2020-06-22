module.exports = (options, peers, heartbeats) => {

  const needle = require('needle')

  return {

    send:(address, message) => {

      if(!address || !message){
        console.log('Address or message not specified, required.')
        return false
      }

      if(!peers.getPeer(address)){
        console.log('Not connected to specified address.')
        return false
      }

      // send message to addres
      needle.get(address + `/message?message=${message}`, function(error, response) {
        if(error) console.log('Error sending message to address', address)
        if(!error && response.statusCode == 200) console.log('client send', response.body)
      })

      return true

    },

    broadcast:message => {
      peers.getAllPeers().forEach(address => {
        needle.get(address + `/message?message=${message}`, function(error, response) {
          if(error) console.log('Error sending message to address', address)
          if(!error && response.statusCode == 200) console.log('client broadcast', response.body)
        })
      })
    },

    connect:address => {
      needle.get(address + `/connect?address=${options.myAddress}`, function(error, response) {
        if(error) peers.remove(address)
        if(!error && response.statusCode == 200) heartbeats.update(address)
      })
    }
  }
}
