import {Model} from '@vuex-orm/core'

export default class InterestTag extends Model {
  static entity = 'interestTag'
  static firestore = true
  static primaryKey = ['id']
  static isLoaded = false
  static fields () {
    return {
      id: this.attr(null),
      tag_id: this.attr(''),
      interest_id: this.attr('')
    }
  }
}
