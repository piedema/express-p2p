const needle = require('needle')

module.exports = function(options, db, peers){

  let { host, port, autoRemove, myAddress } = options

  db.filter().forEach((address) => {
    console.log('send get /adopt to', address)
    console.log(myAddress)
    newRequest('get', address, '/adopt', { address:myAddress }, function(error, response) {
      if(error){
        console.log('removing address due to no /adopt response', address)
        db.remove(address)
        console.log(error)
      }
      if(response){
        console.log('i am adopted by', address, 'response', response.body)
      }
    })
  })

  setInterval(() => {
    db.filter().forEach((address) => {
      console.log('send get /heartbeat to', address)
      newRequest('get', address, '/heartbeat', { address:myAddress }, function(error, response, body) {
        if(error){
          console.log('removing address due to no /heartbeat response', address)
          db.remove(address)
          console.log(error)
        }
        if(response && response.body.success){
          console.log('reply to /heartbeat request recieved')
        }
      })
    })
  }, autoRemove * 0.4)

  function newRequest(type = 'get', address, endpoint, data = {}, cb){
    needle.request(type, address + endpoint, data, (error, response, body) => {
      cb(error, response, body)
    })
  }

  return {

    get:(address, endpoint, data, cb) => {
      newRequest('get', address, endpoint, data, cb)
    },

    post:(address, endpoint, data, cb) => {
      newRequest('delete', address, endpoint, data, cb)
    },

    put:(address, endpoint, data, cb) => {
      newRequest('put', address, endpoint, data, cb)
    },

    delete:(address, endpoint, data, cb) => {
      newRequest('delete', address, endpoint, data, cb)
    }
  }
}
