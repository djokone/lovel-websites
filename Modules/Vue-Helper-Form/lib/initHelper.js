import { forEach, cloneDeep } from 'lodash'

const grouped = function (input) {
  let grouped
  if (typeof input.grouped === 'boolean') {
    if (!getName(input) && input.grouped) {
      grouped = false
      console.warn('Can\'t group because you\'ve got any name for the group', input)
    } else {
      grouped = input.grouped
    }
  } else if (input.grouped === 'string') {
    grouped = true
  } else {
    // Default behavior when grouped is not set
    if (getName(input)) {
      grouped = true
    }
    if (getType(input)) {
    } else if (getType(input) === 'form') {
      grouped = true
    }
    if (!getName(input)) {
      grouped = false
    }
  }
  return grouped
}

const getDefaultValue = function (input, key = false) {
  let data
  let type = getType(input)
  if (input.inputs) {
    data = fetchInputs(input.inputs)
    // console.log(data)
  } else if (input.forms) {
    data = fetchInputs(input.forms)
  } else if (input.value) {
    data = cloneDeep(input.value)
  } else if (type === 'number') {
    data = 0
  } else if (type === 'checkbox') {
    data = false
  } else {
    data = ''
  }
  // console.log(data)
  // if (this.grouped(input)) {
  // } else {
  // }
  return data
}

const getName = function (input, key = false) {
  let name = ''
  if (!key && typeof key === 'string') {
    name = key
  }
  if (input.name) {
    name = input.name
  }
  if (input.name && typeof key === 'string') {
    console.warn('Warning: the name has been set twice, all before has been overwrited')
  }
  return name
}

const getLabel = function (input) {
  if (typeof input.label === 'undefined') {
    return input.name
  } else {
    return input.label
  }
}

const getType = function (input) {
  if (typeof input.forms !== 'undefined') {
    return 'form'
  } else if (typeof input.type !== 'undefined') {
    return input.type
  } else {
    return 'text'
  }
}

// Fetch all the inputs injected
const fetchInputs = function (inputs) {
  // console.log(inputs)
  let datas = {}
  forEach(inputs, (input, key) => {
    let name = getName(input, key)
    if (!name && (input.forms || input.inputs) && grouped(input)) {
      console.error('Error: The input number ' + key + ' has no name !')
    } else {
      let defaultValue = getDefaultValue(input)
      // console.log(name)
      // console.log(defaultValue)
      if (typeof defaultValue === 'object' && grouped(input)) {
        datas[name] = defaultValue
      } else if (typeof defaultValue === 'object' && !grouped(input)) {
        forEach(defaultValue, (v, k) => {
          datas[k] = v
        })
      } else if (getType(input) === 'btn') {
        // Do nothing
      } else {
        datas[name] = defaultValue
      }
    }
  })
  return datas
}

// Initialize vue object
const initData = function (obj) {
  let data = fetchInputs(obj.inputs)
  return data
}

export {
  initData,
  fetchInputs,
  getType,
  getLabel,
  getName,
  getDefaultValue,
  grouped
}
