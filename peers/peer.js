module.exports = function(address){

  function updateProp(variable, data){
    variable = data
    return variable
  }

  return {

    getAddress:() => { return address },

    getPropsArray:() => { return [ address ]},
    getPropsObject:() => { return { address:address}},
    getPropsString:() => { return address },

    updateAddress:(_address) => { return updateProp(address, _address) }
  }
}
