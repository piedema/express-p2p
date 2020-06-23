module.exports = (options, store) => {

  const data = require('../data/peerslist')

  return {

    getPeer:address => { return data.peers[data.peers.indexOf(address)] },

    getAllPeers:() => { return data.peers },

    getAdded:address => {

      return data.added.map(peer => { if(peer === address) return peer })

    },

    getAllAdded:() => { return data.added },

    getRemoved:address => {

      return data.removed.map(peer => { if(peer === address) return peer })

    },

    getAllRemoved:() => { return data.removed },

    add:address => {

      if(options.blacklist && blacklist.get(address)){
        console.log('Address is blacklisted.')
        return false
      }

      if(options.whitelist && !whitelist.get(address)){
        console.log('Address is not whitelisted.')
        return false
      }

      if(!data.peers.includes(address)){
        data.peers.push(address)
        data.added.push({ address: address, time:Date.now() })
        store('peerslist', data)
        return true
      }

      return false
    },

    remove:address => {

      console.log('need to remove address', address)

      if(data.peers.includes(address)){
        data.peers.splice(data.peers.indexOf(address), 1)
        data.removed.push({ address: address, time:Date.now() })
        store('peerslist', data)
        return true
      }

      return false
    }
  }
}
