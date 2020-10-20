import {Model} from '@vuex-orm/core'
import Tag from '@/Modules/Tags/Services/Tag'
import InterestTag from './InterestTag'

export default class Interest extends Model {
  static entity = 'interests'
  static firestore = true
  static isLoaded = false
  static primaryKey = 'id'
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      parent_id: this.attr(null),
      childrens: this.hasMany(this, 'parent_id'),
      parent: this.belongsTo(this, 'parent_id'),
      tags: this.belongsToMany(Tag, InterestTag, 'interest_id', 'tag_id')
    }
  }
  // static beforeProcess (model) {
  //   console.log(model)
  //   console.log('after select')
  // }
}
