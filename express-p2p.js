module.exports = function(opts){

  const eventEmitter = new (require('events').EventEmitter)
  const fs = require('fs')

  const config = require('./data/config.json')

  const options = {
    myAddress:opts.myAddress || false,
    ws:opts.ws || false,
    autoConnect:opts.autoConnect || false,
    blacklist:opts.blacklist || false,
    whitelist:opts.whitelist || false,
    heartbeatInterval:opts.heartbeatInterval || config.heartbeatInterval,
    autoRemoveInterval:opts.autoRemoveInterval || config.autoRemoveInterval,
    port:opts.port || config.port
  }

  if(!options.myAddress) return console.log('You should specify your addres (ip+port) where you can ben contacted.')
  //if(!options.ws) console.log('Warning: options.ws not specified or false, switching to requests.')
  //if(!options.autoConnect) console.log('Warning: options.autoConnect not specified or false, not autoConnecting to network. use connect(\'address\') or connectAll() to connect to (a) peer(s).')
  if(options.blacklist && options.whitelist) return console.log('Cannot use both blacklist and whitelist, exiting.')
  if(!options.blacklist) console.log('Warning: options.blacklist not specified or false, not using blacklist.')
  if(!options.whitelist) console.log('Warning: options.whitelist not specified or false, not using whitelist.')
  if(!options.heartbeatInterval) console.log('Warning: options.heartbeatInterval not specified or false, using default 1 hour interval.')
  if(!options.autoRemoveInterval) console.log('Warning: options.autoRemoveInterval not specified or false, using default 10 hour interval.')
  if(options.autoRemoveInterval < options.heartbeatInterval) console.log(`Warning: options.autoRemoveInterval is smaller than options.heartbeatInterval, all peers will be disconnected after options.autoRemoveInterval/${options.autoRemoveInterval} seconds.`)

  const store = (name, data) => {
    fs.writeFile(`./data/${name}.json`, JSON.stringify(data), err => {
      if(err) return console.log('Error saving file', name, err)
      return console.log(`File ${name} saved!`)
    })
  }

  let heartbeats = {}, peers = {}, server = {}, client = {}, blacklist = {}, whitelist = {}

  peers = require('./lib/peers')(options, store)
  heartbeats = require('./lib/heartbeats')(options, peers)
  client = require('./lib/client')(options, peers, heartbeats)
  server = require('./lib/server')(options, heartbeats, blacklist, whitelist)
  blacklist = require('./lib/blacklist')(options, store)
  whitelist = require('./lib/whitelist')(options, store)

  if(opts.peers) opts.peers.forEach(address => peers.add(address))

  peers.getAllPeers().forEach(peer => client.connect(peer))

  return {

    setOptions:opts => { for(let option in opts) options[option] = opts[option] },
    getOptions:() => { return options },

    heartbeats:heartbeats,
    client:client,
    peers:peers,
    blacklist:blacklist,
    whitelist:whitelist,

    events:eventEmitter

  }
}
