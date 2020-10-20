/* eslint-disable no-new */
/**
 * Core classes imports
 */
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
// import VuexORMSearch from '@vuex-orm/plugin-search'
import DatabaseManager from '@/Modules/DatabasesManager/DatabaseManager'
import '@/config/firebaseLovelCloud.js'

/**
 * VuexORM Entities imports
 */
import {
  User
} from '@/Modules/Users/Services/User'
import Game from '@/Modules/Games/Services/Game'
import Challenge from '@/Modules/Challenges/Services/Challenge'
import Interest from '@/Modules/Interets/Services/Interest'
import InterestTag from '@/Modules/Interets/Services/InterestTag'
import Tag from '@/Modules/Tags/Services/Tag'
import Setting from '@/Modules/Settings/Services/Setting'
import Subscription from '@/Modules/Subscription/Services/Subscription'
import Mailchimp from '@/Modules/MailChimp/Services/Mailchimp'
import Match from '@/Modules/Matches/Services/Match'
import Type from '@/Modules/Games/Services/Type'
import Auth from '@/Modules/Auth/Services/Auth'
import LogicGroup from '@/Modules/Requirements/Services/LogicGroup'
import Requirement from '@/Modules/Requirements/Services/Requirement'
import Media from '@/Modules/Medias/Services/Media'
import Interaction from '@/Modules/Matches/Services/Interaction'
// import Social from '@/Modules/Socials/Services/Social'

/**
 * Vuex store imports
 */
import users from '@/Modules/Users/Services/users'
import auth from '@/Modules/Auth/Services/auths'
import challenges from '@/Modules/Challenges/Services/challenges'
import interests from '@/Modules/Interets/Services/Interests'
import tags from '@/Modules/Tags/Services/tags'
import notifications from '@/Modules/Notifs/Services/notifications'
import settings from '@/Modules/Settings/Services/settings'
import subscriptions from '@/Modules/Subscription/Services/subscriptions'
import mailchimps from '@/Modules/MailChimp/Services/mailchimps'
import firestore from '@/Modules/DatabasesManager/Services/firestore'
import matchs from '@/Modules/Matches/Services/matchs'
import types from '@/Modules/Games/Services/types'
import logicGroups from '@/Modules/Requirements/Services/logicGroups'
import medias from '@/Modules/Medias/Services/medias'
import interactions from '@/Modules/Matches/Services/interactions'
// import socials from '@/Modules/Socials/Services/socials'

// console.log(DatabaseManager.databasesConfigs)
// import FirebaseVuexOrmHooks from '../Modules/VuexOrmFirebase/VuexOrmFirebase'
// import FirebaseVuexOrm from '@/Modules/VuexOrmFirebase'

/**
 * Register Local Store database
 * @type {VuexORM.Database}
 */
const database = new VuexORM.Database()
database.register(User, users)
// database.register(Profil, {})
database.register(Game, {})
database.register(Interest, interests)
database.register(Tag, tags)
database.register(InterestTag, {})
database.register(Subscription, subscriptions)
database.register(Setting, settings)
database.register(Mailchimp, mailchimps)
database.register(Challenge, challenges)
database.register(Match, matchs)
database.register(Type, types)
database.register(Auth, auth)
database.register(LogicGroup, logicGroups)
database.register(Requirement, {})
database.register(Media, medias)
database.register(Interaction, interactions)
// database.register(Social, socials)

/**
 * Prepare databases config that as been added throw Schemas
 * Use database VueXORM Object to navigate between Entities schemas
 * @Todo Make an Object to install modules Services
 */
DatabaseManager.databasesConfigs.forEach((databaseConfig) => {
  let i = 0
  database.entities.forEach((entity) => {
    if (entity.model.firestore) {
      console.log('firestore activate for ' + entity.name + ' for ' + databaseConfig.projectId + 'database')
      if (!database.entities[i].model.databases) {
        database.entities[i].model.databases = {}
      }
      entity.model.databases[databaseConfig.projectId] = {
        allLoaded: false
      }
    }
    i++
  })
})

/**
 * Register Modules services into VuexORM Databases with there own namespaces for each firebase databases
 * @type {Array} To be inject through Vuex store initialization
 */
let VuexORMDatabases = []
DatabaseManager.databasesConfigs.forEach((databaseConfig) => {
  let FirestoreDatabase = new VuexORM.Database()
  database.entities.forEach((entity) => {
    if (entity.model.firestore) {
      FirestoreDatabase.register(entity.model, entity.module)
    }
  })
  VuexORMDatabases.push(VuexORM.install(FirestoreDatabase, {
    namespace: databaseConfig.projectId
  }))
})
// console.log(VuexORMDatabases)

// Firebases Hooks
// new FirebaseVuexOrmHooks()
// VuexORM.use(FirebaseVuexOrm,
//   {
//     database
//   })
// Vue.prototype.$DatabaseManager = database
export const vuexModules = {
  auth,
    users,
    // notifications,
    subscriptions,
    interests,
    tags,
    settings,
    mailchimps,
    challenges,
    firestore,
    matchs,
    types,
    logicGroups,
    medias,
    interactions
  // socials
}

export const firestoreManager = database

export const plugins = [...VuexORMDatabases, VuexORM.install(database)]

