import {
  Model
} from '@vuex-orm/core'
import Media from '@/Modules/Medias/Services/Media'
import Challenge from '@/Modules/Challenges/Services/Challenge'

// export class Social extends Model {
//   static entity = 'socials'

//   static fields() {
//     return {
//       id: this.attr(null),
//       birthdate: this.attr(''),
//       description: this.attr(''),
//       city: this.attr(''),
//       localization: this.attr('')
//     }
//   }
// }
export default class Interaction extends Model {
  static entity = 'interactions'
  static primaryKey = 'id'
  static firestore = true
  static fields () {
    return {
      id: this.attr(null),
      state: this.attr(''),
      type: this.attr(''),
      content: this.attr(null),
      match_id: this.attr(null),
      challenge_id: this.attr(null),
      challenge: this.belongsTo(Challenge, 'challenge_id'),
      media: this.morphMany(Media, 'ref_id', 'ref'),
      from_user_id: this.attr(null),
      to_user_id: this.attr(null),
      created: this.attr(null),
      sended: this.attr(null),
      replied: this.attr(null),
      watched: this.attr(null)
    }
  }
  get score () {
    let score = 0
    if (this.challenge_id) {
      if (this.sended) score += 1
      if (this.replied) score += 1
    }
    return score
  }
}
