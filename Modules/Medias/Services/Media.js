import { Model } from '@vuex-orm/core'
// import { User } from '@/Modules/Users/Services/User'

export default class Media extends Model {
  static entity = 'medias'
  static primaryKey = 'id'
  static firestore = true
  static fields () {
    return {
      id: this.attr(null),
      created: this.attr(''),
      created_user_id: this.attr(''),
      ref: this.attr(''),
      storage_path: this.attr(''),
      storage_uri: this.attr(''),
      ref_id: this.attr(''),
      local_path: this.attr(''),
      base64: this.attr(''),
      type: this.attr(''),
      index: this.attr('')
      // createdBy: this.hasOne(User, 'created_user_id', 'id')
    }
  }
}
