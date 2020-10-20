import helpersInput from '../Components/HelperInput'
import helpersForm from '../Components/HelperForm'
import { isEmpty, forEach } from 'lodash'
// import { RdebugChild, RdebugAddForm } from './recursiveDebug'

// Lunch the recursive while in the component object for dispatching
// Put container to false to get just the childrens
let dispatchRoot = function (obj, create, input = obj, container = true) {
  let childrens = []
  // When inputs is inject in inputs
  if (typeof input.inputs !== 'undefined') {
    childrens = [...generateFormInputs(obj, create, input)]
  }
  if (obj.root && container) { //  If is root and need a container, then create the uniq root container
    return createRootContainer(obj, create, createFormContainer(obj, create, childrens))
  } else if (container) { //  If is a recursive root dispatch
    return createFormContainer(obj, create, childrens)
  } else if (!isEmpty(childrens)) { //  If there are childrens
    return childrens
  } else {
    return false
  }
}

let generateFormInputs = function (obj, create, input) {
  let form = []
  input.inputs.forEach((inputs, key) => { // For each input pass to a form
    if (obj.getType(inputs) !== 'form') { // After the form is created
      // Only inputs
      // During the input generation
      form.push(dispatch(obj, create, inputs)) // create inputs input
    } else { // Before the form is created (Parent instance)
      let childForm = []
      if (obj.haveNew(inputs)) {
        // let btn = createBtn(obj, create, inputs)
        childForm.push(create(
          'div',
          {
            'class': 'multiforms addNew ' + obj.getName(inputs)
          },
          [dispatch(obj, create, inputs)]) // Create the form for new
        )
      }
      // Create multiforms
      if (obj.localData[obj.getName(inputs)] !== 'undefined' && Array.isArray(obj.localData[obj.getName(inputs)])) {
        forEach(obj.getValue(inputs), (value, key) => {
        // Create form for each index in data array
          let child = []
          if (typeof inputs.title === 'function') {
            child.push(createTitle(obj, create, inputs, value, key))
          }
          child.push(dispatch(obj, create, inputs, key))
          let myForm = create('div', {
            'class': 'multiforms ' + obj.getName(inputs),
            attrs: {
              id: obj.getName(inputs) + '-' + key
            }
          }, child)
          childForm.push(myForm) // create child forms
        })
      }
      form.push(create('div', {
        'class': 'multiform-container ' + obj.getName(inputs)
      }, childForm))
    }
  })
  return form
}

// Lunch the right function in a while
// to make all it's chit working
let dispatch = function (obj, create, input, key = false) {
  let toReturn = []
  if (obj.getType(input) === 'form') {
    toReturn = createHelperForm(obj, create, input, key)
  } else if (obj.getType(input) === 'groupe' || obj.getType(input) === 'group' || obj.getType(input) === 'wrap') {
    toReturn = createGroupContainer(obj, create, input)
  } else if (obj.getType(input) === 'btn') {
    if (obj.getBehaviors(input) !== false) {
      forEach(obj.getBehaviors(input), (v, k) => {
        if (v === 'add' && obj.new) {
          toReturn = createBtn(obj, create, input)
        }
        if ((v === 'edit' || v === 'del') && !obj.new) {
          toReturn = createBtn(obj, create, input)
        }
      })
    }
  } else {
    toReturn = createInput(obj, create, input)
  }
  return toReturn
}

let createTitle = function (obj, create, input, value = false, key = false) {
  if (typeof input.title(create, dispatch(obj, create, input, key), value, key) === 'string') {
    return create('h' + (obj.deep + 2), {
      DomProps: {
        innerHTML: input.title(create, dispatch(obj, create, input, key), value, key)
      }
    })
  } else {
    return input.title(create, dispatch(obj, create, input, key), value, key)
  }
}

let createBtn = function (obj, create, input = obj) {
  let classes = input.class || []
  let behavior = input.behavior || ''
  let params = {
    'class': ['submit', ...[behavior], ...[classes]],
    domProps: {
      innerHTML: obj.getLabel(input)
    }
  }
  params.on = []
  if (behavior) {
    params.on['click'] = function (event) {
      event.preventDefault()
      obj.beforeUpButton(event, behavior)
    }
  } else {
    console.warn('Warn : A behavior is missing for your button, use {behavior: "add"} or {behavior: "del"} to sync your actions')
  }
  let btn = create('button', params)
  return btn
}
// create a custom input
let createInput = function (obj, create, input) {
  if (obj.grouped(input)) {
  }
  let props = {
    label: obj.getLabel(input),
    name: obj.getName(input),
    type: obj.getType(input),
    placeholder: obj.getPlaceholder(input),
    value: obj.getValue(input)
  }

  if (input.options) {
    props['options'] = input.options
  }
  if (input.component) {
    props['component'] = input.component
  }
  let on = {
    input: obj.upInput
  }
  return create(
    helpersInput,
    {
      'class': [input.class],
      on,
      props: props
    }
  )
}

// Create a new helper form inside a helper form
let createHelperForm = function (obj, create, input, key = false) {
  let props = {}
  let on = {}
  let isNew = false
  if (key === false) {
    isNew = true
  }
  let deep = obj.deep + 1
  if (obj.hasForms(input) && obj.getType(input)) {
    props = {
      inputs: input.forms,
      root: false,
      new: isNew,
      index: key,
      deep,
      name: input.name,
      hasToBeGrouped: obj.hasToBeGroup(input)
    }
  }
  // on['input'] = obj.upInput
  on['upForm'] = obj.upForm
  on['upInput'] = obj.upInput
  on['upButton'] = obj.upButton
  if (!obj.name) {
    props['parent'] = 'root'
  } else {
    props['parent'] = obj.name
  }
  if (key !== false) {
    props['data'] = obj.getValue(input)[key]
  }
  return create(
    helpersForm,
    {
      props,
      on
    }
  )
}

let createGroupContainer = function (obj, create, input, childrens) {
  childrens = childrens || []
  let classes = []
  let classe = input.class ? input.class : ''
  classes.push(classe)
  let getRoot = dispatchRoot(obj, create, input, false)
  if (getRoot) {
    childrens = getRoot
  }
  return create(
    'div',
    {
      'class': [classes]
    },
    childrens
  )
}

let createFormContainer = function (obj, create, childrens) {
  return create(
    'form',
    {
      'class': ['forms']
    },
    childrens
  )
}

// Create a root container
let createRootContainer = function (obj, create, childrens) {
  let vnodeArray = []
  vnodeArray.push(childrens)
  return create(
    obj.tag, {
    },
    vnodeArray
  )
}

export default dispatchRoot
