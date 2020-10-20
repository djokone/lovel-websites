import {
  Model
} from '@vuex-orm/core'
// import Auth from '@/modules/Auth/Services/Auth'
// import Media from '@/modules/Medias/Services/Media'
import Interaction from './Interaction'
import {
  User
} from '@/Modules/Users/Services/User'

export default class Match extends Model {
  static entity = 'matchs'
  static primaryKey = 'id'
  static firestore = true
  static fields () {
    return {
      id: this.attr(null),
      state: this.attr(''),
      level: this.attr(0),
      last_visite: this.attr(''),
      from_user_id: this.attr(''),
      from_user: this.belongsTo(User, 'from_user_id', 'id'),
      to_user_id: this.attr(''),
      to_user: this.belongsTo(User, 'to_user_id'),
      user_ids: this.attr([]),
      from_last_visite: this.attr(''),
      to_last_visite: this.attr(''),
      messages: this.hasMany(Interaction, 'match_id'),
      created: this.attr(null),
      updated: this.attr(null)
    }
  }

  // dynamicState (Auth) {
  //   this.
  // }

  get totalScore () {
    let total = 0
    if (Array.isArray(this.messages) && this.messages) {
      this.messages.forEach((interaction) => {
        if (interaction.score) {
          total += interaction.score
        }
      })
    }
    return total
  }

  get test () {
    return 'test'
  }

  get levelProgress () {
    let levelGoal = [4, 8]
    let score = this.totalScore
    // if (this.level === 1) {
    //   score = score - levelGoal[0]
    // }

    let Accomplished = score / levelGoal[this.level]
    return Accomplished
  }
}
