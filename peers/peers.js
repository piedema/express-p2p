const Peer = require('./peer.js')

module.exports = function(db){

  let peersHolder = {}

  db.filter().forEach((address) => {
    peersHolder[address] = new Peer(address)
  })

  return {

    add:function(address){
      return peersHolder[address] = new Peer(address)
    },

    remove:function(address){
      return delete peersHolder[address]
    },

    filter:function(value = null, type = 'string'){
      let response = []
      for(let address in peersHolder){
        if(type === 'array'){
          if(value && peersHolder[address].getPropsString().includes(value)) response.push(peersHolder[address].getPropsArray())
          else response.push(peersHolder[address].getPropsArray())
        }
        if(type === 'object'){
          if(value && peersHolder[address].getPropsString().includes(value)) response.push(peersHolder[address].getPropsObject())
          else response.push(peersHolder[address].getPropsObject())
        }
        if(type === 'string'){
          if(value && peersHolder[address].getPropsString().includes(value)) response.push(peersHolder[address].getPropsString())
          else response.push(peersHolder[address].getPropsString())
        }
      }
      return response
    },

    peer:function(address){
      return peersHolder[address]
    },

    update:function(address = null, host = null, port = null){
      if(address) peers[address].updateAddress(address)
      return true
    }
  }
}
