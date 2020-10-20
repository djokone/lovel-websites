// import * as firebase from 'firebase/app'
// import { getData } from '@/libs/FirebaseUtils'
import Game from './Game'
import Database from '@/Modules/DatabasesManager/DatabaseManager'
import Type from './Type'
import Challenge from '@/Modules/Challenges/Services/Challenge'

export async function adminLoadTypes ({
  dispatch,
  getters
}, params = {
  entity: Type,
  collection: 'types',
  lasLoad: true,
  query: false,
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    entity: Type,
    collection: 'types',
    lasyLoad: true,
    query: false,
    verbose: getters.debug,
    Firestore: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  return await dispatch('firestoreLoadEntities', params)
}

export async function adminLoadGames ({
  dispatch,
  getters
}, params = {
  entity: Game,
  collection: 'games',
  lasyLoad: true,
  query: false,
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    entity: Game,
    collection: 'games',
    lasyLoad: true,
    query: false,
    verbose: getters.debug,
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  return await dispatch('firestoreLoadEntities', params)
}
export async function adminLoadGame ({
  dispatch,
  getters
}, params = {
  id: false,
  lasyLoad: false,
  collection: 'games',
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    id: false,
    entity: Game,
    lasyLoad: false,
    collection: 'games',
    verbose: getters.debug,
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  return await dispatch('firestoreLoadEntity', params)
}

export async function adminFirestoreAddGame ({
  dispatch,
  getters
}, {
  preSave = true,
  toSave,
  verbose = getters.debug,
  ignoreFields = ['$id', 'id', 'interests', 'game']
}) {
  return await dispatch('firestoreAddEntity', {
    entity: Game,
    preSave,
    data: toSave,
    ignoreFields,
    verbose
  })
}

export async function adminEditGames ({
  dispatch,
  getters
}, {
  id,
  toSave,
  ignoreFields = ['$id', 'id', 'interests'],
  verbose = getters.debug
}) {
  console.log('start edit Game')
  let response = await dispatch('firestoreEditEntity', {
    id,
    entity: Game,
    data: toSave,
    ignoreFields,
    verbose
  })
  return response
}

export async function adminRemoveGames ({
  dispatch,
  getters
}, {
  id,
  verbose = getters.debug,
  entity = Game
}) {
  return dispatch('firestoreDeleteEntity', {
    id,
    entity,
    verbose
  })
}

export async function adminDeleteGame ({
  dispatch,
  getters
}, {
  id,
  entity = Game,
  verbose,
  deleteChallenges = false
}) {
  try {
    await dispatch('firestoreDeleteEntity', {
      id,
      entity,
      verbose
    })
  } catch (e) {
    throw e
  }
  if (deleteChallenges) {
    let challenges = getters[Database.currentId + '/challenges/query']()
      .where('game_id', id)
      .get()
    try {
      await dispatch('firestoreDeleteEntities', {
        data: challenges,
        verbose,
        entity: Challenge
      })
    } catch (e) {
      throw e
    }
  }
}
