// import * as firebase from 'nativescript-plugin-firebase'
// import {
//     log,
//     error
// } from '@/libs/Verbose'

import Database from '@/Modules/DatabasesManager/DatabaseManager'
import {
  User
} from '@/Modules/Users/Services/User'

/**
 * Admin Firestore Load users
 * @param dispatch
 * @param params
 * @returns {Promise<*>}
 **/

export async function adminDeleteUser ({
  dispatch
}, {
  entity,
  id
}) {
  try {
    let user = await dispatch('firestoreDeleteEntity', {
      id: id,
      entity,
      verbose: true
    })
    console.log('Success')
    console.log(user)
  } catch (e) {
    console.log(e)
    console.log('Cannot delete user')
    throw e
  }
  try {
    await dispatch('adminDeleteAuth', {
      uid: id
    })
  } catch (e) {
    throw e
  }
}

// export async function updateUserCollection ({
//   dispatch
// }, {
//   data,
//   uid,
//   verbose = false,
//   preSave = true,
//   waitFirestore = true
// }) {
//   try {
//     let user = await dispatch('firestoreEditEntity', {
//       id: uid,
//       data,
//       entity: User,
//       preSave,
//       firestoreMethod: 'update',
//       ignoreFields: ['thumbs', 'auth', 'id', '$id'],
//       verbose,
//       waitFirestore
//     })
//     console.log('finish')
//     console.log(user)
//   } catch (e) {
//     console.log(e)
//     console.log('problem !!!!')
//     throw e
//   }
// }

// export async function initLoggedUser ({ dispatch }, {
//   uid,
//   data = {},
//   verbose = true
// }) {
//   let userSynced = await dispatch('firestoreLoadEntity', {
//     id: uid,
//     entity: User,
//     verbose
//   })
//   if (!userSynced.exists) {
//     userSynced = await dispatch('firestoreEditEntity', {
//       id: uid,
//       entity: User,
//       preSave: false,
//       data,
//       verbose
//     })
//   }
//   return userSynced
// }

export async function adminLoadUsers ({
  dispatch,
  getters
}, params = {
  entity: User,
  collection: 'users',
  lasyLoad: true,
  query: false,
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    entity: User,
    collection: 'users',
    lasyLoad: true,
    query: false,
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  console.log('here')
  console.log(params)
  return await dispatch('firestoreLoadEntities', params)
}

export async function adminLoadUser ({
  dispatch,
  getters
}, params = {
  id: false,
  lasyLoad: false,
  collection: 'users',
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    id: false,
    verbose: getters.debug,
    entity: User,
    lasyLoad: false,
    collection: 'users',
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  console.log(params)
  return await dispatch('firestoreLoadEntity', params)
}

export async function adminAddUser ({
  dispatch
}, {
  data,
  verbose = true,
  entity = User,
  ignoreFields = ['id', '$id']
}) {
  return await dispatch('firestoreAddEntity', {
    verbose,
    entity,
    data,
    ignoreFields
  })
}

export async function adminEditUser ({
  dispatch
}, {
  id,
  toSave,
  verbose,
  preSave = true,
  ignoreFields = ['$id', 'id', 'thumbs', 'auth'],
  authData = false
}) {
  console.log('start edit user')
  let response = await dispatch('firestoreEditEntity', {
    id,
    verbose,
    entity: User,
    data: toSave,
    ignoreFields
  })
  if (authData) {
    await dispatch('adminEditAuth', {
      id,
      verbose,
      toSave
    })
  }
  return response
}

/**
 * Syncronize Authenticate user
 * @param {Object} store - Vuex store that are automatically injected when the action is called by Vuex dispatch method
 * @param {Function} store.dispatch - Vuex dispatch function
 * @param {String} uid User collection uid to sync
 */
export async function syncWithUserCollection ({
  dispatch
}, uid) {
  // let usersCollection = firebase.firestore.collection('users')
  // let connectedUser = usersCollection.doc(uid)
  // let user = await connectedUser.get()
  // if (!user.exists) {
  //   user = await connectedUser.set({})
  // }
  // let data = {
  //   id: uid,
  //   ...user.data()
  // }
  // log('sync medias')
  // // await dispatch('getRefMediasFirebase', {
  // //   ref: 'users',
  // //   ref_id: uid
  // // })
  // let userEntity = await dispatch('entities/users/create', {
  //   data
  // })
  // return userEntity
}

// export async function adminLoadUsers ({dispatch, getters}, {
//   entity: Users
// }) {
//
// }

/**
 * First Users loaded When the user starting is research
 * @todo Use search query parametre to filter server response data
 * @param {Object} store - Vuex store that are automatically injected when the action is called by Vuex dispatch method
 * @param {Function} store.dispatch - Vuex dispatch function
 * @param {Object} Search
 */
export async function loadUsersForResearch ({
  dispatch
}, search) {
  // log('Load User Search')
  // log('....................')
  // let usersCollection = firebase.firestore.collection('users')
  // let query = usersCollection
  //   // To Do handle query with user personal settings
  // query.get().then(querySnap => {
  //   querySnap.forEach((doc) => {
  //     log('user loaded')
  //     log(`Load User: ${doc.id} => ${JSON.stringify(doc.data())}`)
  //     dispatch('entities/users/insert', {
  //       data: {
  //         id: doc.id,
  //         ...doc.data()
  //       }
  //     })
  //     dispatch('loadUserMedias', {
  //       uid: doc.id
  //     })
  //   })
  // })
}

/**
 * Load Medias belongs to a specific user
 * @param {Object} store - Vuex store that are automatically injected when the action is called by Vuex dispatch method
 * @param {Function} store.dispatch - Vuex dispatch function
 * @param {Object} options - Update user collection options
 * @param {Object} options.data - New data to update the collection
 * @param {String} options.uid - The User Id to update
 */
export async function loadUserMedias ({
  dispatch
}, uid) {
  // await dispatch('getRefMediasFirebase', {
  //   ref: 'users',
  //   ref_id: uid
  // })
}

/**
 * Update a user document with new data
 * @param {Object} store - Vuex store that are automatically injected when the action is called by Vuex dispatch method
 * @param {Function} store.dispatch - Vuex dispatch function
 * @param {Object} options - Update user collection options
 * @param {Object} options.data - New data to update the collection
 * @param {String} options.uid - The User Id to update
 */
// export async function updateUserCollection ({
//     dispatch
// }, {
//     data,
//     uid
// }) {
//   // let usersCollection = firebase.firestore.collection('users')
//   // let connectedUser = usersCollection.doc(uid)
//   // log('Update user collection')
//   // log(data)
//   // await connectedUser.set(data)
//   // dispatch('entities/users/update', {
//   //   where: uid,
//   //   data
//   // })
// }

/**
 * Add a user media cover
 * @param {Object} store - Vuex store that are automatically injected when the action is called by Vuex dispatch method
 * @param {Function} store.dispatch - Vuex dispatch function
 * @param {Object} Media to add in profile cover
 */
export async function addUserCover ({
  dispatch
}, data) {
  // log('add User')
  // try {
  //   log('add User Cover')
  //   let image = {
  //     ...data,
  //     ref: 'users',
  //     type: 'image'
  //   }
  //   let cover = await dispatch('addMediaFirebase', image)
  //   log(cover)
  //   return cover
  // } catch (e) {
  //   error('In addUserCover function : ', e)
  //   throw e
  // }
}

/**
 * Remove a User media
 * @param {Object} store - Vuex store that are automatically injected when the action is called by Vuex dispatch method
 * @param {Function} store.dispatch - Vuex dispatch function
 * @param {String} uid - Media uid to remove
 */
export async function removeUserCover ({
  dispatch
}, uid) {
  // dispatch('removeMediaFirebase', uid)
}

/**
 * Upload a Media to the user profile
 * @param {Object} store - Vuex store that are automatically injected when the action is called by Vuex dispatch method
 * @param {Function} store.dispatch - Vuex dispatch function
 * @param {*} media - The media to upload
 */
export async function uploadProfilMedias ({
  dispatch
}, media) {
  // let
}
