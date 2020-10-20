// import HelpersTinymce from '@/HelpersTinymce.vue'
import conditionalArray from './conditionalArray'
import { forEach } from 'lodash'

let inputDispatcher = function (obj, create, children) {
  let vnodeArray = []
  vnodeArray.push(createLabel(obj, create))
  // console.log(obj.component)
  if (obj.component) {
    // console.log('component')
    vnodeArray.push(createCustomComponent(obj, create))
  } else if (obj.options) {
    vnodeArray.push(createSelect(obj, create))
  } else {
    vnodeArray.push(createInput(obj, create))
  }
  return createInputContainer(obj, create, vnodeArray)
}
let dispatchProperties = function (obj) {
  let attrs = {
    id: obj.name + '_' + obj.primary,
    type: obj.type,
    placeholder: obj.placeholder,
    name: obj.name
  }
  let vnodeOptions = {}
  let directives = []
  let domProps = {
    value: obj.localData
  }
  let on = {
    input: function (event) {
      // obj.localData = event.target.value
      // console.log(event.target.value)
      obj.upLocal(event.target.value)
      obj.$emit('input', obj.name, event.target.value)
    }
  }
  let isNormalInput = conditionalArray(obj.type, ['text', 'password', 'date', 'email', 'url', 'number'])
  let needModel = conditionalArray(obj.type, ['radio', 'textarea'])
  if (isNormalInput || needModel) {
  }
  if (obj.type === 'number') {
    if (obj.min) {
      attrs['min'] = obj.min
    }
    if (obj.max) {
      attrs['max'] = obj.max
    }
  }
  vnodeOptions = {
    attrs,
    directives,
    on,
    domProps
  }
  return vnodeOptions
}

let createCustomComponent = function (obj, create) {
  // let props = propertiesGroup(obj, ['value', 'name'])
  // console.log(props)
  return create(obj.component, {
  })
  // return create(HelpersTinymce, {
  //   init: obj.value
  // })
}
let createLabel = function (obj, create) {
  return create('label',
    {
      attrs: {
        for: obj.name + '_' + obj.primary
      },
      domProps: {
        innerHTML: obj.label
      }
    }
  )
}
let createSelect = function (obj, create) {
  let childs = []
  let props = dispatchProperties(obj)
  // console.log(obj.options)
  if (obj.options) {
    forEach(obj.options, (v, k) => {
      // console.log(v)
      childs.push(createSelectOpt(obj, create, k, v))
    })
  }
  return create('select', props, childs)
}

let createSelectOpt = function (obj, create, key, value) {
  let selectOpt = []
  let res = {}
  if (typeof value === 'object') {
    forEach(value, (v, k) => {
      if (typeof v === 'object') {
        console.log('Error: Recursive select is not avaible yet !')
      } else {
        let props = {
          attrs: {
            value: k,
            disabled: obj.disabled
          },
          domProps: {
            innerHTML: v
          }
        }
        if (obj.value === k) {
          props['attrs']['selected'] = true
        }
        selectOpt.push(create('option', props))
      }
    })
    res = create('optgroup', {
      attrs: {
        label: key
      }
    }, selectOpt)
  } else {
    let props = {
      attrs: {
        value: key,
        disabled: obj.disabled
      },
      domProps: {
        innerHTML: value
      }
    }
    if (key === obj.value) {
      props['attrs']['selected'] = true
    }
    res = create('option', {
      props
    })
  }
  return res
}

let createInput = function (obj, create) {
  let properties = dispatchProperties(obj)
  return create('input',
    properties
  )
}
let createInputContainer = function (obj, create, childrens) {
  return create('div',
    {
      'class': {
        input: true
      }
    },
    childrens
  )
}

export default inputDispatcher
