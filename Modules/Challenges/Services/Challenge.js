import {Model} from '@vuex-orm/core'
import Interest from '@/Modules/Interets/Services/Interest'
import Game from '@/Modules/Games/Services/Game'
import Type from '@/Modules/Games/Services/Type'

// Query.on('afterUpdate', (records, entity) => {
//   console.log(records)
//   console.log(entity)
//   console.log('afterUpdate in challenge')
//   return false
// })

export default class Challenge extends Model {
  static entity = 'challenges'
  static primaryKey = 'id'
  static firestore = true
  static isFetch = false
  static allLoaded = false
  static fields () {
    return {
      id: this.attr(''),
      name: this.attr(''),
      description: this.attr(''),
      game_id: this.attr(''),
      type_id: this.attr([]),
      // interest_id: this.attr(null),
      required: this.attr(null),
      interests_ids: this.attr([]),
      interests: this.hasManyBy(Interest, 'interests_ids', 'id'),
      game: this.belongsTo(Game, 'game_id'),
      online: this.attr(''),
      type: this.hasManyBy(Type, 'type_id', 'id'),
      creatorId: this.attr('')
    }
  }
  static beforeCreate (model) {
    if (!Challenge.isFetch) {
      model['created'] = Date.now()
    }
    // console.log('before create')
    // console.log(model)
    // console.log(Challenge.isFetch)
  }
}
