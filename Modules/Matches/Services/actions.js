import Match from '@/Modules/Matches/Services/Match'
import Database from '@/Modules/DatabasesManager/DatabaseManager'
// import firebase from 'firebase/app'
import 'firebase/firestore'

export async function adminDeleteMatch ({dispatch, getters}, {
  id,
  verbose = getters.debug,
  entity = Match
}) {
  await dispatch('adminDeleteMatchInteractions', {
    matchId: id,
    verbose: true
  })
  if (verbose) {
    console.log('#############')
    console.log('Delete Match')
  }
  await dispatch('firestoreDeleteEntity', {
    id,
    verbose,
    entity
  })
}

export async function adminLoadMatches ({
  dispatch,
  getters
}, params = {
  entity: Match,
  collection: 'matchs',
  lasyLoad: true,
  query: false,
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    entity: Match,
    collections: 'matchs',
    lasyLoad: false,
    query: false,
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  let matches = await dispatch('firestoreLoadEntities', params)
  console.log(matches)
  let interactions = []
  await matches.entities.forEach(async (element) => {
    interactions.push(await dispatch('loadMatchInteractions', {
      matchId: element.id
    }))
  })
  console.log('HERE----', interactions)
  return {
    interactions,
    matches
  }
}

export async function adminLoadMatch ({
  dispatch,
  getters
}, params = {
  id: false,
  lasyLoad: false,
  collection: 'matchs',
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    id: false,
    entity: Match,
    verbose: getters.debug,
    lasyLoad: false,
    collection: 'matchs',
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  console.log(params)
  return await dispatch('firestoreLoadEntity', params)
}

export async function adminAddMatch ({
  dispatch
}, {
  data,
  verbose = true,
  entity = Match,
  ignoreFields = ['$id', 'id', 'from_user', 'messages', 'to_user']
}) {
  let date = Database.firebase.firestore.Timestamp.now()
  data.created = date.toDate()
  data.updated = date.toDate()
  data.user_ids = [data.from_user_id, data.to_user_id]
  return await dispatch('firestoreAddEntity', {
    verbose,
    entity,
    data,
    ignoreFields
  })
}

export async function adminEditMatch ({
  dispatch
}, {
  id,
  toSave,
  verbose,
  ignoreFields = ['$id', 'id']
}) {
  console.log('start edit match')
  let date = Database.firebase.firestore.Timestamp.now()
  toSave.updated = date.toDate()
  let response = await dispatch('firestoreEditEntity', {
    id,
    verbose,
    entity: Match,
    data: toSave,
    ignoreFields
  })
  return response
}
