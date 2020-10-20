import {
  Model
} from '@vuex-orm/core'
import Auth from '@/Modules/Auth/Services/Auth'
import Media from '@/Modules/Medias/Services/Media'
// // // import UserSettings from '@/Modules/UserSettings/Services/UserSettings'
// import Social from '@/Modules/Socials/Services/Social'
import moment from 'moment'

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

export class Profil extends Model {
  static entity = 'users'
  static fields () {
    return {
      id: this.attr(null),
      firstname: this.attr(''),
      auth: this.hasOne(Auth, 'uid', 'id')
      // profil: this.hasOne(Social, 'id')
    }
  }
}
export class User extends Model {
  static entity = 'users'
  static primaryKey = 'id'
  static firestore = true
  static fields () {
    return {
      id: this.attr(null),
      onboard: this.attr(false),
      birthdate: this.attr(''),
      gender: this.attr(''),
      city: this.attr(''),
      auth: this.hasOne(Auth, 'uid', 'id'),
      // social: this.hasOne(Social, 'id', 'id'),
      researchGender: this.attr([]),
      researchDistance: this.attr(40),
      researchAge: this.attr({
        min: 18,
        max: 30
      }),
      // // userSettings: this.hasOne(UserSettings, 'uid'),
      researchRelationKind: this.attr(''),
      thumbs: this.morphMany(Media, 'ref_id', 'ref'),
      firstname: this.attr(''),
      lastname: this.attr(''),
      displayName: this.attr(''),
      description: this.attr('')
    }
  }
  get age () {
    return moment().diff(moment(this.birthdate, 'D-M-YYYY'), 'years')
  }
  get cover () {
    // if (this.thumbs) {
    //   let cover = this.thumbs.find(t => {
    //     return t.index === 1;
    //   });
    //   if (cover) {
    //     return cover
    //   } else {
    //     return this.thumbs[0]
    //   }

    // } else {
    //   return false
    // }
  }
  get isValidForResearch () {
    return Boolean(this.city) && Boolean(this.displayName) && Boolean(this.gender) && Boolean(this.researchGender)
  }
}
