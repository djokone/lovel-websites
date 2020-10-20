import {Model} from '@vuex-orm/core'
// import Requirement from '@/Modules/Requirements/Services/Requirement'

export default class LogicGroup extends Model {
  static entity = 'logicGroups'
  static primaryKey = 'id'
  static firestore = true
  static fields () {
    return {
      id: this.attr(''),
      label: this.attr(''),
      isRequired: this.attr(false),
      logicOperator: this.attr(''),
      requirements: this.attr([]),
      logicGroups: this.attr([])
    }
  }
}
