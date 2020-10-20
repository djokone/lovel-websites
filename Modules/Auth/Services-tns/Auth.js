import { Model } from '@vuex-orm/core'
import { User } from '@/modules/Users/Services/User'

export default class Auth extends Model {
  static entity = 'auths'
  static primaryKey = 'uid'
  static fields () {
    return {
      uid: this.attr(null),
      name: this.attr(''),
      role: this.attr(''),
      email: this.attr(''),
      emailVerified: this.attr(Boolean),
      isAnonymous: this.attr(Boolean),
      anonymous: this.attr(Boolean),
      phoneNumber: this.attr(''),
      profileImageURL: this.attr(''),
      user: this.hasOne(User, 'id')
    }
  }
}
