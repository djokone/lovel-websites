import {Model} from '@vuex-orm/core'

class Subscription extends Model {
  static entity = 'subscriptions'

  static fields () {
    return {
      id: this.attr(null),
      mail: this.attr(''),
      created: this.attr(''),
      modified: this.attr('')
    }
  }
}

export default Subscription
