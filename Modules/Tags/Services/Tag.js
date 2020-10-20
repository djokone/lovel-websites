import {Model} from '@vuex-orm/core'
// import InterestTag from '@/Modules/Interets/Services/InterestTag'
// import Interest from '@/Modules/Interets/Services/Interest'

export default class Tag extends Model {
  static entity = 'tags'
  static firestore = true
  static primaryKey = 'id'
  static isLoaded = false
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
      // interests: this.belongsToMany(Interest, InterestTag, 'tag_id', 'interest_id')
    }
  }
}
