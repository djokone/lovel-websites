// import * as firebase from 'firebase/app'
// import { getData } from '@/libs/FirebaseUtils'
import Database from '@/Modules/DatabasesManager/DatabaseManager'
import Challenge from './Challenge'
// import { cloneDeep } from 'lodash'

export async function adminLoadChallenges ({
  dispatch,
  getters
}, params = {
  entity: Challenge,
  collection: 'challenges',
  lasyLoad: true,
  query: false,
  verbose: true,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    entity: Challenge,
    collection: 'challenges',
    lasyLoad: true,
    query: false,
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  return await dispatch('firestoreLoadEntities', params)
}

export async function adminLoadChallenge ({
  dispatch,
  getters
}, params = {
  id: false,
  lasyLoad: false,
  collection: 'challenges',
  verbose: true,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    id: false,
    verbose: true,
    entity: Challenge,
    lasyLoad: false,
    collection: 'challenges',
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  console.log(params)

  // if ()
  return await dispatch('firestoreLoadEntity', params)
  // let ChallengesCollections = firebase.firestore().collection('challenges').doc(params.id)
  // let challenge = await ChallengesCollections.get()
  // let entity = await Challenge.insertOrUpdate({
  //   data: {
  //     id: params.id,
  //     ...challenge.data()
  //   },
  //   insertOrUpdate: ['interests']
  // })
  // console.log(entity)
  // return entity
}

export async function adminAddFirestoreChallenge ({
  dispatch,
  getters
}, {
  preSave = true,
  toSave,
  verbose = getters.debug,
  ignoreFields = ['$id', 'id', 'interests', 'game']
}) {
  return await dispatch('firestoreAddEntity', {
    entity: Challenge,
    preSave,
    verbose,
    data: toSave,
    ignoreFields
  })
  // let ChallengeCollection = await firebase.firestore().collection('challenges')
  // let challengeAdded = await ChallengeCollection.add(data)
  // let challenge = await challengeAdded.get()
  // console.log(challenge)
  // data['id'] = challenge.id
  // return await Challenge.insert({
  //   data
  // })
  //
  // let subChallenge = await dispatch('getFirestoreSubInterets', {
  //   challenges,
  //   Challenge
  // })
  // console.log(subInteret)
}

export async function adminEditChallenges ({
  dispatch,
  getters
}, {
  id,
  toSave,
  verbose = getters.debug,
  ignoreFields = ['$id', 'id', 'interests', 'game']
}) {
  return await dispatch('firestoreEditEntity', {
    id,
    entity: Challenge,
    data: toSave,
    verbose,
    ignoreFields
  })
}

export async function adminRemoveChallenge ({
  dispatch,
  getters
}, {
  id,
  verbose = getters.debug,
  entity = Challenge
}) {
  return await dispatch('firestoreDeleteEntity', {
    id,
    verbose,
    entity
  })
}
