import {Model} from '@vuex-orm/core'

export default class Requirement extends Model {
  static entity = 'requirements'
  static primaryKey = 'id'
  static firestore = true
  static fields () {
    return {
      id: this.attr(''),
      label: this.attr(''),
      type: this.attr(''),
      conditionalOperator: this.attr(''),
      value: this.attr(''),
      valueToCompare: this.attr('')
    }
  }
}
