const fs = require('fs')

const Server = require('./express/server.js')
const Client = require('./express/client.js')
const DB = require('./db/db.js')
const Peers = require('./peers/peers.js')

const config = require('./data/config.json')
const dbFile = require('./data/db.json')

const options = {}
const warnings = []

let db, peers, server, client

module.exports = function(opts){

  let isInit = false

  options.port = parseInt(opts.port) || config.port || 8080
  options.autoRemoveInterval = config.autoRemoveInterval || 3600000

  db = new DB(dbFile)
  peers = new Peers(db)
  client = new Client(options.port, options.autoRemoveInterval, db, peers)
  server = new Server(options, db, peers, client)

  isInit = true

  return {

    isInit:function(){
      return isInit
    },

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

    client:client
  }
}
