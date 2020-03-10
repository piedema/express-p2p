const externalIp = require('external-ip')()
const needle = require('needle')

module.exports = function(port, autoRemoveInterval, db, peers){

  let myAddress

  externalIp((err, ip) => {
    if (err) { throw err }

    myAddress = ip + ':' + port

    db.filter().forEach((address) => {
      console.log('send get /adopt to', address)
      needle.request('get', address + '/adopt', { address:myAddress }, function(error, response) {
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
        needle.request('get', address + '/heartbeat', { address:myAddress }, function(error, response, body) {
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
    }, autoRemoveInterval * 0.4)
  })

  return {

    newRequest:function(type = 'get', address = null, endpoint, data = {}, cb){
      if(!address){
        db.filter().forEach((address) => {
          needle.request(type, address + endpoint, data, (error, response, body) => {
            cb(error, response, body)
          })
        })
        return
      }
      needle.request(type, address + endpoint, data, (error, response, body) => {
        cb(error, response, body)
      })
    }
  }
}
