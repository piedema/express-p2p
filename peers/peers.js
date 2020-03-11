const Peer = require('./peer.js')

module.exports = function(db){

  let peersHolder = {}

  db.filter().forEach((address) => {
    peersHolder[address] = new Peer(address)
  })

  return {

    add:function(address){
      db.add(address)
      return peersHolder[address] = new Peer(address)
    },

    remove:function(address){
      db.remove(address)
      return delete peersHolder[address]
    },

    filter:function(value = null, type = 'string'){
      let response = []
      for(let address in peersHolder){
        if(type === 'array'){
          if(value && address.includes(value)) response.push(peersHolder[address].getPropsArray())
          else if(!value) response.push(peersHolder[address].getPropsArray())
        }
        if(type === 'object'){
          if(value && address.includes(value)) response.push(peersHolder[address].getPropsObject())
          else if(!value) response.push(peersHolder[address].getPropsObject())
        }
        if(type === 'string'){
          if(value && address.includes(value)) response.push(peersHolder[address].getPropsString())
          else if(!value) response.push(peersHolder[address].getPropsString())
        }
      }
      return response
    },

    peer:function(address){
      return peersHolder[address]
    },

    update:function(old_address = null, new_address){
      if(address){
        peersHolder[old_address].updateAddress(new_address)
      }
      return true
    }
  }
}
