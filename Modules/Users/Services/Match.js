import {Model} from '@vuex-orm/core'

export default class Match extends Model {
  static entity = 'matchs'
  static firestore = true
  static isLoaded = false
  static primaryKey = 'id'
  static fields () {
    return {
      id: this.attr(null),
      from_user_id: this.attr(null),
      to_user_id: this.attr(null),
      created: this.attr(''),
      state: this.attr('')
    }
  }
}
