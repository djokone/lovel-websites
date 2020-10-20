import {Model} from '@vuex-orm/core'
// import Interest from '@/Modules/Interets/Services/Interest'

// Query.on('afterUpdate', (records, entity) => {
//   console.log(records)
//   console.log(entity)
//   console.log('afterUpdate in Game')
//   return false
// })

export default class Game extends Model {
  static entity = 'games'
  static firestore = true
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      rules: this.attr(''),
      parent_ids: this.attr(null),
      type: this.attr(null),
      online: this.attr('')
    }
  }
}
