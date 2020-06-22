module.exports = (options, store) => {

  if(!options.blacklist) return undefined

  const data = require('../data/blacklist.json')

  return {

    get:address => { return data.blacklisted[data.blacklisted.indexOf(address)] },

    getAll:() => { return data.blacklisted },

    add:address => {
      if(!data.blacklisted.includes(address)){
        console.log('Address is blacklisted')
        data.blacklisted.push(address)
        store('blacklist', data)
        return
      }
      console.log('Address already blacklisted.')
      return false
    },

    getAdded:() => {
      return data.added
    },

    remove:address => {
      if(data.blacklisted.includes(address)){
        console.log('Address is removed from blacklist.')
        data.blacklisted.splice(data.blacklisted.indexOf(address), 1)
        store('blacklist', data)
        return
      }
      console.log('Address was not on blacklist.')
      return false
    },

    getRemoved:() => {
      return data.removed
    }
  }
}
