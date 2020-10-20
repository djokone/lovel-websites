import {Model} from '@vuex-orm/core'

export default class Type extends Model {
  static entity = 'types'
  static firestore = true
  static isLoaded = false
  static primaryKey = 'id'
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}
