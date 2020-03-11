const fs = require('fs')

const Server = require('./express/server.js')
const Client = require('./express/client.js')
const DB = require('./db/db.js')
const Peers = require('./peers/peers.js')

const config = require('./data/config.json')
const dbFile = require('./data/db.json')

const options = {}
const warnings = []

let db, peers, server, client, myAddress

module.exports = function(opts){

  if(opts.host && opts.port){
    config.host = opts.host
    config.port = opts.port
    fs.writeFileSync('./data/config.json', JSON.stringify(config), (error) => {
      if(error){
        console.log(error)
        return false
      }
      return true
    })
  }

  options.host = opts.host || config.host || 'localhost'
  options.port = parseInt(opts.port) || config.port || 8080
  options.myAddress = options.host + ':' + options.port
  options.autoRemove = 3600000

  myAddress = options.myAddress

  db = new DB(dbFile)
  peers = new Peers(db)
  client = new Client(options, db, peers)
  server = new Server(options, db, peers, client)

  return {

    warnings:function(){
      // return array with warnings
      return warnings
    },

    options:{

      get:function(property = null){
        return options[property] || options
      },

      set:function(data){
        for(let property in data) if(options.property) options.property = data.property
        return true
      }

    },

    peers:peers,

    server:server,

    client:client,

    myAddress:myAddress
  }
}
