const RdebugChild = function (obj, child, input) {
  console.log('----------------------------')
  console.log('Child -----------------------')
  console.log('name:' + obj.getName(child))
  console.log('value:' + obj.getValue(child))
  console.log('type:' + obj.getType(child))
  console.log('Parent -----------------------')
  console.log('name:' + obj.getName(input))
  console.log('type:' + obj.getType(input))
  // console.log(input)
  console.log('----------------------------')
}

const RdebugAddForm = function (obj, child, input) {
  console.log('Create form -----------------------')
  console.log('name child:' + obj.getName(child))
  console.log('name input:' + obj.getName(input))
  console.log('name parent:' + obj.parent)
  console.log('End form -----------------------')
}

export {
  RdebugChild,
  RdebugAddForm
}
