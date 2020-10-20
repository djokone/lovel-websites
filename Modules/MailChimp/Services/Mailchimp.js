import {Model} from '@vuex-orm/core'

class List extends Model {
  static entity = 'lists'

  static fields () {
    return {
      id: this.attr(null),
      mailchimp_id: this.attr('')
    }
  }
}

class Mailchimp extends Model {
  static entity = 'mailchimps'

  static fields () {
    return {
      id: this.attr(null),
      List: this.hasMany(List, 'mailchimp_id')
    }
  }
}

export default Mailchimp
