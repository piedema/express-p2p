const fs = require('fs')

module.exports = function(list){

  function savelistDB(){
    fs.writeFileSync('./data/db.json', JSON.stringify(list), (error) => {
      if(error){
        console.log(error)
        return false
      }
      return true
    })
  }

  return {

    filter:function(keyword = null){
      if(keyword){
        let response = []
        list.peers.forEach((peer) => {
          if(peer.includes(keyword)) response.push(peer)
        })
        return response
      }
      else return list.peers
    },

    add:function(value){
      list.peers.push(value)
      return savelistDB()
    },

    remove:function(keyword){
      let index = list.peers.indexOf(keyword)
      if(index >= 0){
        list.peers.splice(index, 1)
        return savelistDB()
      }
      else return false
    },

    update:function(keyword, value){
      let index = list.peers.indexOf(keyword)
      list.peers[index] = value
      return savelistDB()
    },

    replaceDB:function(newList){
      list = newList
      return savelistDB()
    }
  }
}
