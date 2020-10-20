import { Model } from '@vuex-orm/core'
import Setting from '@/Modules/Settings/Services/Setting'

export default class UserSettings extends Model {
  static entity = 'userSettings'
  static primaryKey = 'uid'
  static firestore = true
  static fields () {
    return {
      uid: this.attr(null),
      settings_ids: this.attr([]),
      settings: this.belongsTo(Setting, 'settings_ids')
    }
  }
}
