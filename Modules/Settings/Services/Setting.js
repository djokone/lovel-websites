import {Model} from '@vuex-orm/core'

class Setting extends Model {
  static entity = 'settings'

  static fields () {
    return {
      id: this.attr(null),
      type: this.attr(''),
      value: this.attr(''),
      params: this.attr({})
    }
  }
}

export default Setting
