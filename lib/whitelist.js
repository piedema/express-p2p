module.exports = (options, store) => {

  if(!options.whitelist) return undefined

  const data = require('./data/whitelist.json')

  return {

    get:address => { return data.whitelisted[data.whitelisted.indexOf(address)] },

    getAll:() => { return data.whitelisted },

    add:address => {
      if(!data.whitelisted.includes(address)){
        console.log('Address is whitelisted')
        data.whitelisted.push(address)
        store('whitelist', data)
        return
      }
      console.log('Address already whitelisted.')
      return false
    },

    getAdded:() => {
      return data.added
    },

    remove:address => {
      if(data.whitelisted.includes(address)){
        console.log('Address is removed from whitelist.')
        data.whitelisted.splice(data.whitelisted.indexOf(address), 1)
        store('whitelist', data)
        return
      }
      console.log('Address was not on whitelist.')
      return false
    },

    getRemoved:() => {
      return data.removed
    }
  }
}
