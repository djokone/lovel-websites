import VuexOrmFirebase from './VuexOrmFirebase'
// import Model from '@vuex-orm/core'
const plugin = {
  install (components, options) {
    console.log('initFirebase Vuex Orm')
    return new VuexOrmFirebase(components, options)
  }
}

export default plugin
