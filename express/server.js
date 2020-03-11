const express = require('express')
const app = express()

const needle = require('needle')

module.exports = function(options, db, peers, client){

  let { host, port, myAddress } = options

  let heartbeats = {}

  app.listen(port, () => { console.log('server listening on port', port)})

  app.get('/adopt', (req, res) => {
    let address = req.query.address
    console.log('recieved get /adopt from ', address)
    if(db.filter(address).length === 0){
      heartbeats[address] = Date.now()
      let added = db.add(address)
      return res.status(200).json({ success:true, isAdded:added })
    }
    if(db.filter(address).length === 1) return res.status(500).json({ success:false, message:'Address is allready present in DB' })
    if(db.filter(address).length > 1) return res.status(500).json({ success:false, message:'Multiple results on address in DB' })
    if(!address) return res.status(500).json({ succes:false, message:'address parameter not recieved' })
  })

  app.get('/heartbeat', (req, res) => {
    let address = req.query.address
    console.log('recieved get /heartbeat from ', address)
    if(heartbeats[address]){
      heartbeats[address] = Date.now()
      return res.status(200).json({ success:true })
    }else{
      return res.status(500).json({ success:false })
    }
  })

  app.all('*', (req, res) => {
    console.log('route not (yet) available on server')
    res.status(500).json({ success:false, message:'Route not (yet) available on server' })
  })

  return {

    options:{

      get:function(){
        //return ipc.config
        return null
      },

      set:function(config){
        // for(let prop in config) ipc.config[prop] = config[prop]
        // return ipc.config
        return null
      }
    },

    get:function(endpoint, cb){
      app.get(endpoint, (req, res) => {
        cb(req, res)
      })
    },

    post:function(endpoint, cb){
      app.post(endpoint, (req, res) => {
        cb(req, res)
      })
    },

    put:function(endpoint, cb){
      app.put(endpoint, (req, res) => {
        cb(req, res)
      })
    },

    delete:function(endpoint, cb){
      app.delete(endpoint, (req, res) => {
        cb(req, res)
      })
    }
  }
}
