<template>
  <div></div>
</template>
<script>
  // createForm
  // createInput = function (obj, create, children) {
  //   obj()
  // }
  import dispatchRoot from '../lib/FormUtils'
  import { initData, fetchInputs, grouped, getName, getType } from '../lib/initHelper'
  import { isEmpty, cloneDeep, find } from 'lodash'

  export default({
    name: 'HelperForm',
    render (h) {
      return dispatchRoot(this, h)
    },
    data () {
      return {
        localData: {},
        success: true,
        response: {}
      }
    },
    props: {
      deep: {
        default: 0
      },
      reset: {
        default: false
      },
      tag: {
        default: 'div',
        type: [String]
      },
      root: {
        default: true,
        type: [Boolean]
      },
      index: {
        default: false
      },
      parent: {
        default: false
      },
      name: {
        default: false
      },
      multiple: {
        default: false
      },
      new: {
        default: false
      },
      inputs: {
        type: [Array, Object]
      },
      data: {
        default: function () {
          // return {}
          return initData(this)
        }
      }
    },
    created () {
      this.downData()
    },
    computed: {
      validate () {
        if (this.error && !this.success) {
          return false
        } else {
          return true
        }
      }
    },
    /**
    * Methods Forms
    * @param {{foo: ?number, bar: string}} param - this is object param.
    *
    * @function downData (data)
    * @function upInput (key, value, childs = [])
    * @function mergeParents (parents, wantRoot = false)
    * @function upForm (data)
    * @function btnSuccessCallback (behavior, change, parents, callback)
    * @function btnErrorCallback (behavior, change, parents, callback)
    * @function beforeUpButton (event, behavior, change, parents = [], success = false, error = false)
    *
    *
    */
    methods: {
      /**
      * Propagate the new data Props to the local state
      *
      * @param      {Object}  data    The data from props
      */
      downData (data) {
        data = data || cloneDeep(this.data)
        this.$set(this, 'localData', data)
      },
      upData (target, key, value) {
        this.$set(target, key, value)
      },
      /**
      * Propagate the new data Props to the local state
      *
      * @param      {Object}  data    The data from props
      */
      upDataInput (key, value, deep, childs = []) {
        let target = this.localData
        let that = this
        let data = {}
        data[key] = value
        console.log(childs)
        console.log(deep)
        if (deep) {
          childs.forEach((v, k) => {
            // let prev = k - 1
            // let next = k + 1
            if (v === 'new' && !that.new) {
              // target[.push(data)]
            } else {
              // console.log(value)
              target = target[v]
            }
          })
        } else {
          // target = target[]
        }
        // console.log(target)
        console.log('updateTarget')
        console.log(target)
        console.log(key)
        console.log(value)
        this.upData(target, key, value)
      },
      /**
      * Propagate inputs events to the root
      *
      * @param      {Object}  data    The data from props
      */
      upInput (key, value, childs = [], deep = 0) {
        this.$off('input')
        childs = this.mergeParents(childs)
        if (childs[childs.length - 1] !== 'new') {
          this.upDataInput(key, value, deep, childs)
        }
        if (this.root) { // if is the last parent
          this.$emit('input', key, value, childs)
          this.$emit('updated', this.localData, false, false)
        } else {
          // this.$off('input')
          this.$emit('upInput', key, value, childs, deep + 1)
          this.$emit('upForm', key, value, childs)
        }
      },
      /**
       * Merge new parents into an array
       *
       * @param      {Array}  parents  The parents to merge
       * @param      {Boolean}  wantRoot  To put root at the begining of the array
       *
       * return     {Array} An array of parents with the new parents
       */
      mergeParents (parents, wantRoot = false) {
        let newParents = []
        let name = this.name
        if (!name && wantRoot) {
          name = 'root'
        }
        if (name) {
          newParents.push(name)
        }
        if (this.index !== false) {
          newParents.push(this.index)
        } else if (this.new) {
          newParents.push('new')
        }
        if (isEmpty(parents) && !isEmpty(newParents)) {
          parents = newParents
        } else {
          parents = [...newParents, ...parents]
        }
        return parents
      },
      /**
       * Back up the form event to the root when updates happen
       *
       * @param      {String}  key      The name of this input how changed
       * @param      {String}  value    New value of this input
       * @param      {Number}  index    Index of the instance
       * @param      {Array}  parents   List of all the parents of the form
       *
       * @emits {update} emit update when it's root.
       * @emits {upForm} emit upForm in all the parents inside the component.
       */
      upForm (key, value, index, parents) {
        // if (!this.new) {
        //   // upData
        // }
        //
        // console.log(this.localData)
        if (this.root) {
          let newVal = {}
          newVal = {
            key,
            value
          }
          this.$emit('update', this.localData, newVal, parents)
        } else {
          parents = this.mergeParents(parents)
          this.$emit('upForm', key, value, this.index, parents)
        }
      },
      /**
       * Callback lunched with success() in the listening behavior function
       * Will do the right success mutations inside the local state
       *
       * @param      {String}    behavior  The behavior
       * @param      {Object}    change    Just what's changed
       * @param      {Array}    parents    All the parents in the array
       * @param      {Function}  callback  The callback to do next
       *
       */
      btnSuccessCallback (behavior, change, parents, callback) {
        if (this.new) {
          this.resetForm()
        }
        if (typeof callback === 'function') {
          callback()
        }
      },
      /**
       * Callback lunched with error() in the listening behavior function
       * Will do the right success mutations inside the local state
       *
       * @param      {String}    behavior  The behavior
       * @param      {Object}    change    Just what's changed
       * @param      {Array}    parents    All the parents in the array
       * @param      {Function}  callback  The callback to do next
       */
      btnErrorCallback (behavior, change, parents, callback) {
        if (typeof callback === 'function') {
          console.log('error btn')
          callback()
        }
      },
      beforeUpButton (event, behavior, change, parents = [], success = false, error = false) {
        if (this.validate) {
          if (success === false && error === false) {
            this.upButton(event, behavior, this.localData, parents, this.btnSuccessCallback, this.btnErrorCallback)
          } else {
            this.$emit('upButton', event, behavior, change, parents, success, error)
          }
        } else {
          //  send error
        }
      },

      /**
       * Back up button event
       *
       * @param      {Object}    event            The event javascript object
       * @param      {String}    behavior         The behavior attach to the event
       * @param      {Object}    change           The change in the form l
       * @param      {Array}     parents          Go to the merge function to add all tne new
       *                                          parents during the propagation
       * @param      {Function}  success          The succes to lunch if it's all good
       * @param      {Function}  error            The error to lunch when trouble happen
       * @param      {Number}    deepPropagation  The deep propagation level
       * @param      {boolean}   parentLocalData  The parent local data
       *
       * @emits {update} emit update when it's root.
       * @emits {upForm} emit upForm in all the parents inside the component.
       *
       */
      upButton (event, behavior, change = this.localData, parents = [], success, error, deepPropagation = -1, parentLocalData = false) {
        let successCallback
        deepPropagation++
        let that = this
        console.log(this.localData)
        parents = this.mergeParents(parents)
        if (behavior === 'add') {
          successCallback = function (callback) {
            that.addLocalForm(change, parents, deepPropagation, parentLocalData)
            if (typeof callback === 'function') {
              callback()
            }
            success()
          }
        }
        if (behavior === 'del') {
          successCallback = function (callback) {
            that.removeLocalForm(change, parents, deepPropagation)
            success()
          }
        }
        let finalSuccess = success
        if (typeof successCallback === 'function') {
          finalSuccess = successCallback
        }
        if (this.root) { // When the event is propagate until the root
          if (Array.isArray(behavior)) {
            behavior = behavior[0]
          }
          if (this.hasToSendCallbackInside(behavior)) {
            if (this.validate) {
              finalSuccess()
            } else {
              error()
            }
          } else {
            this.$emit(behavior, finalSuccess, error, event, change, parents, this.localData)
          }
        } else {
          this.$emit('upButton', event, behavior, change, parents, finalSuccess, error, deepPropagation, this.localData)
        }
      },
      upDataForm (data, child) {
        let localData = cloneDeep(data)
        if (!Array.isArray(this.localData[child])) {
          this.$set(this.localData, child, [localData])
        } else {
          this.localData[child].push(localData)
        }
      },
      resetForm () {
        let inputDefaultValue = fetchInputs(this.inputs)
        this.$set(this, 'localData', inputDefaultValue)
      },
      addLocalForm (change, parents, actualDeep = false, parent = false) {
        console.log(this.new)
        if (actualDeep === 1 && !this.new) {
          console.log(actualDeep)
          this.upAddLocalDataForm(change, parents, actualDeep, parent)
        }
      },
      upAddLocalDataForm (change, parents, actualDeep = false, parent = false) {
        let child = parents[2] // Take the last parent
        // let last = parents[parents.length - 1]
        // let rootCall = false
        if (parents.length < 2) { child = parents[0] }
        if (parent !== false) {
          change = cloneDeep(parent)
        }
        console.log(change)
        this.upDataForm(change, child)
      },
      removeLocalForm (data, parents, actualDeep) {
        let last = parents[parents.length - 1]
        if (last === 'new') {
          console.warn('Can\'t remove a form how\'s not created, not suppose to happen !')
        }
        console.log(parents)
        console.log(data)
      },
      haveNew (input) {
        if (input.new) {
          return input.new
        } else {
          return true
        }
      },
      hasToSendCallbackInside (behavior) {
        if (Array.isArray(behavior)) {
          behavior = behavior[0]
        }
        return isEmpty(find(this.$listeners, (v, k) => {
          return k === behavior
        }))
      },
      hasForms (input) {
        return typeof input.forms !== 'undefined'
      },
      hasInputs (input) {
        return typeof input.inputs !== 'undefined'
      },
      hasToBeGroup (input) {
        if (input.type === 'groupe') {
          return false
        } else if (this.hasForms(input)) {
          return true
        }
      },
      getInputs (input) {
        if (this.hasForms) {
          return this.forms
        } else {
          return this.inputs
        }
      },
      getPlaceholder (input) {
        if (typeof input.placeholder === 'undefined') {
          return input.name
        } else {
          return input.placeholder
        }
      },
      grouped (input) {
        return grouped(input)
      },
      getValue (input) {
        let value = this.localData
        return value[this.getName(input)]
      },
      getNew (input) {
        if (typeof input.new === 'boolean') {
          return input.new
        } else {
          return true
        }
      },
      getBehaviors (input) {
        if (this.getType(input) === 'btn' && !isEmpty(input.behavior)) {
          if (typeof input.behavior === 'string') {
            return [input.behavior]
          } else {
            return input.behavior
          }
        } else { return false }
      },
      getName (input, key = false) {
        return getName(input, key)
      },
      getLabel (input) {
        if (typeof input.label === 'undefined') {
          return input.name
        } else {
          return input.label
        }
      },
      getType (input) {
        return getType(input)
      }
    },
    watch: {
      deep: true,
      data (newVal) {
        this.downData(newVal)
      }
    }
  })
</script>
