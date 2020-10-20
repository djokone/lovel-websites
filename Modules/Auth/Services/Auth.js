import { Model } from '@vuex-orm/core'
import { User } from '@/Modules/Users/Services/User'

export default class Auth extends Model {
  static entity = 'auths'
  static primaryKey = 'uid'
  static firestore = true
  static fields () {
    return {
      uid: this.attr(null),
      name: this.attr(''),
      role: this.attr(''),
      email: this.attr(''),
      emailVerified: this.attr(false),
      isAnonymous: this.attr(false),
      anonymous: this.attr(false),
      phoneNumber: this.attr(''),
      profileImageURL: this.attr(''),
      user: this.hasOne(User, 'id'),
      lovelGroup: this.attr([])
    }
  }
}
