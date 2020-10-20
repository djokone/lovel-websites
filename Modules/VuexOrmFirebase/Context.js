import _ from 'lodash'
// import { db } from './firebaseLovelCloud'
// import { getData } from '@/libs/FirebaseUtils'
import { pluginConfig } from './configs'

class Context {
  /**
   * Private constructor, called by the setup method
   *
   * @constructor
   * @param {Components} components The Vuex-ORM Components collection
   * @param {Options} options The options passed to VuexORM.install
   */
  constructor (components, options) {
    this.components = components
    this.options = _.merge({}, pluginConfig, options)
    if (!options || !options.database) {
      throw new Error('database option is required to initialise!')
    } else {
      this.database = options.database
    }
  }
  /**
   * This is called only once and creates a new instance of the Context.
   * @param {Components} components The Vuex-ORM Components collection
   * @param {Options} options The options passed to VuexORM.install
   * @returns {Context}
   */
  static setup (components, options) {
    this.instance = new Context(components, options)
    return this.instance
  }
  /**
   * Get the singleton instance of the context.
   * @returns {Context}
   */
  static getInstance () {
    return this.instance
  }
  /**
   * Get Model from State
   * @param {object} state
   */
  // getModelFromState(state) {
  //   return _.find(this.database.entities, {
  //     name: state.$name
  //   }).model
  // }
}

export default Context
