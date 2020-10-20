import * as types from './mutation-types'
// import { rev, api } from '../resources'
// import formErrors from '../../FormErrors/formErrors'
// import authSession from '@/config/Auth'
import { auth, db } from '@/config/firebaseLovelCloud'
import { lovelAppPhpServer } from '@/config/PhpResourcesServer'
import { User } from '@/Modules/Users/Services/User'
import Auth from '@/Modules/Auth/Services/Auth'
import Database from '@/Modules/DatabasesManager/DatabaseManager'

/**
 * Google Auth Message Error Converter
 * @type {{default: string, 'auth/wrong-password': string}}
 */
const messagesErrors = {
  default: 'Echec de la connexion',
  'auth/wrong-password': 'Mauvais mot de passe'
}

/**
 *
 * Shortcut function to send a notification
 * @param dispatch Dispatch function
 * @param message Message to send
 * @param success Notification type
 * @returns {Promise<*>}
 */
const dispatchFlash = async function (dispatch, message, success = true) {
  return await dispatch(
    'setFlash',
    {
      message,
      type: success ? 'success' : 'error'
    })
}

/**
 *
 * @param Store
 * @param data
 * @returns {*}
 */
export function login ({dispatch, commit}, data) {
  return auth.signInWithEmailAndPassword(data.mail, data.password).then((response) => {
    dispatch('initUser', response).then((res) => {
      let authData = res.data()
      let uid = res.uid
      // authSession.login({
      //   login: authData.username,
      //   role: authData.role,
      //   uid})
    })
    commit(types.SAVE_AUTH, response)
    dispatchFlash(dispatch, 'Bonjour, vous êtes maintenant connecté')
    return response
  }).catch(function (error) {
    if (error.code) {
      let message = (messagesErrors[error.code]) ? messagesErrors[error.code] : messagesErrors.default
      return dispatchFlash(dispatch, message, false)
    }
    if (error.response) {
      return Promise.reject(error.response)
    }
    return Promise.reject(error)
  })
}

export async function adminDeleteAuth ({dispatch}, {
  uid
}) {
  try {
    let auth = await dispatch('firestoreDeleteEntity', {
      id: uid,
      entity: Auth,
      verbose: true
    })
    // console.log(auth)
  } catch (e) {
    throw e
  }
}

export async function adminCreateAuth ({dispatch}, {
  authData,
  userData,
  verbose,
  ignoreFields = ['password', '$id', 'id', 'user']
}) {
  authData = {...authData}
  userData = {...userData}
  let auths
  if (verbose) {
    console.log('------------------------------')
    console.log('Start create user with on firebase authentification with :')
    console.log('Email :', authData.email)
    console.log('Password :', authData.password)
    console.log('------------------------------')
  }
  auths = await auth.createUserWithEmailAndPassword(authData.email, authData.password)
  if (verbose) {
    console.log('------------------------------')
    console.log('Start Sync Users & Auths collections :')
    console.log(userData)
    console.log(auths)
    console.log()
    console.log('------------------------------')
  }
  let id = auths.user.uid
  await dispatch('firestoreEditEntity', {
    id: id,
    verbose,
    entity: Auth,
    data: authData,
    ignoreFields: ignoreFields
  })
  if (verbose) {
    console.log('------------------------------')
    console.log('New Auth created')
    console.log('Id :', id)
    console.log('Email :', authData.email)
    console.log('------------------------------')
  }
  userData.researchAge.elm = 0
  await dispatch('firestoreEditEntity', {
    id: id,
    verbose,
    entity: User,
    data: userData,
    ignoreFields: ['$id', 'id', 'auth', 'thumbs']
  })
  if (verbose) {
    console.log('------------------------------')
    console.log('New User created')
    console.log('Id :', id)
    console.log('displayName :', userData.displayName)
    console.log('------------------------------')
  }
  return
}

export async function adminLoadAuths ({
  dispatch,
  getters
}, {
  entity = Auth,
  collection = 'auths',
  lasyLoad = true,
  verbose = getters.debug,
  FirestoreId = Database.currentId
}) {
  return await dispatch('firestoreLoadEntities', {
    entity,
    lasyLoad,
    verbose,
    FirestoreId,
    collection
  })
}

export async function adminEditAuth ({
  dispatch
}, {
  id,
  toSave,
  verbose,
  ignoreFields = ['$id', 'id']
}) {
  console.log('start edit auth')
  let response = await dispatch('firestoreEditEntity', {
    id,
    verbose,
    entity: Auth,
    data: toSave,
    ignoreFields
  })
  return response
}

// export async function adminCreateAuth ({ dispatch, getters }, {
//   data,
//   additionalAuthData = {},
//   isAuthenticated = false,
//   phoneConfirmation = false,
//   verbose = true
// }) {
//   data = {
//     ...data
//   }
//   let auths
//   if (!additionalAuthData) {
//     additionalAuthData = {}
//   }
//   if (!isAuthenticated) {
//     if (verbose) {
//       console.log('------------------------------')
//       console.log('Start create user with on firebase authentification with :')
//       console.log('Email :', additionalAuthData.email)
//       console.log('Password :', additionalAuthData.password)
//       console.log('------------------------------')
//     }
//     auths = await auth.createUserWithEmailAndPassword(additionalAuthData.email, additionalAuthData.password)
//   } else {
//     auths = getters['entities/auths/query']().first()
//   }
//   if (phoneConfirmation) {
//     await dispatch('confirmPhone', {
//       phoneNumber: data.phoneNumber,
//       verbose
//     })
//   }
//   if (verbose) {
//     console.log('------------------------------')
//     console.log('Start Sync Users & Auths collections :')
//     console.log('isAuthenticated :', isAuthenticated)
//     console.log(data)
//     console.log(auths)
//     console.log('additional auth data')
//     console.log('------------------------------')
//   }
//   await dispatch('initLoggedUser', {
//     uid: auths.user.uid,
//     verbose
//   })
//   await dispatch('syncWithAuthCollection', {
//     uid: auths.uid,
//     auths: additionalAuthData,
//     verbose
//   })
//   if (verbose) {
//     console.log('------------------------------')
//     console.log('Start Update Users & Auths collections  :')
//     console.log('isAuthenticated :', isAuthenticated)
//     console.log(data)
//     console.log(auths)
//     console.log('------------------------------')
//   }
//   // Update Auth profil in Firestore and VuexStore
//   let authUpdated = await dispatch('updateProfileFirebase', {
//     uid: auths.user.uid,
//     data: {
//       ...data
//     },
//     verbose
//   })
//   // Save birthdate
//   let userUpdated = await dispatch('updateUserCollection', {
//     uid: auths.user.uid,
//     data: data,
//     verbose,
//     preSave: false
//   })
//   if (verbose) {
//     console.log('##############################')
//     console.log('Finish Sign In with that firebase response :')
//     console.log('auth : ')
//     console.log(authUpdated)
//     console.log('User : ')
//     console.log(userUpdated)
//     console.log('##############################')
//   }
//   return {
//     auths: authUpdated,
//     user: userUpdated
//   }
// }

export async function signup ({dispatch}, data) {
  try {
    let auth = await auth.createUserAndRetrieveDataWithEmailAndPassword(data.email, data.password)
    return auth
  } catch (error) {
    if (error.code) {
      let message = (messagesErrors[error.code]) ? messagesErrors[error.code] : messagesErrors.default
      dispatchFlash(dispatch, message, false)
    }
    if (error.response) {
      return error.response
    }
    return error
  }
  // return api.post('users/register').save(data).then((response) => {
  //   if (response.data.success) {
  //     // store.commit(types.)
  //     return response
  //   } else {
  //   }
  // }, (response) => {
  //   return response
  // })
}

export async function initMailList () {
  return lovelAppPhpServer
}

export async function initUser ({commit}, data) {
  let id = data.user.uid
  try {
    let user = await db.collection('/auth/').doc(id).get()
    commit(types.SAVE_USER, user.data())
    return user
  } catch (e) {
    console.error(e.code)
  }
}

export async function adminAddAuth ({dispatch}, {
  data,
  verbose = true,
  entity = Auth,
  uid = User.id,
  ignoreFields = ['id', '&id']
}) {
  return await dispatch('firestoreAddEntity', {
    verbose,
    entity,
    data,
    ignoreFields,
    uid
  })
}

// export function getAuth (store, user) {
//   return auth.collection('auth/' + id).then((response) => {
//       store.commit(types.SAVE_USER, response.data.data)
//       return response.data.data
//     } else {
//       return response.data.data
//     }
//   }).catch((error) => {
//     return error.response
//   })
// }

// export function saveUser (store, data) {
//   return new Promise((resolve, reject) => {
//     store.commit(types.SAVE_USER, data)
//   })
// }
// export function saveProfil (store, {data, id}) {
//   store.commit(types.RESET_ERRORS)
//   return rev.put('users/' + id, data).then((response) => {
//     if (response.data.success === true) {
//       saveUser(store, data)
//       return response.data
//     }
//   }).catch((error) => {
//     console.log(error.response)
//     console.log(error.response.data.data.errors)
//     store.commit(types.SAVE_ERRORS, error.response.data.data.errors)
//     return error.response.data
//   })
// }
//
//
// export function saveAuth (store, token) {
//   return new Promise((resolve, reject) => {
//     store.commit(types.SAVE_AUTH, token)
//     return resolve
//   })
// }
//
// export function addImg (store, data) {
//   return new Promise((resolve, reject) => {
//     store.commit(types.ADD_IMG, data)
//     store.dispatch('setFlash', {message: 'Votre image a bien été ajoutée'})
//   })
// }
//
// export function delImg (store, id) {
//   return rev.delete('medias/' + id).then((response) => {
//     if (response.data.success === true) {
//       // saveUser(store, data)
//       store.commit(types.DEL_IMG, id)
//       store.dispatch('setFlash', {message: 'Votre image a bien été suprimée'})
//       return response.data.data
//     }
//   }).catch((error) => {
//     store.dispatch('setFlash', {
//       message: 'Un problème est survenu avec la suppression de l\'image',
//       type: 'error'
//     })
//     console.log(error.response)
//   })
// }
//
// export function logout (store) {
//   return rev.get('/logout').then((response) => {
//     if (response.data.success) {
//       store.commit(types.LOGOUT)
//       store.dispatch('setFlash', {message: 'Vous êtes maintenant déconnecté'})
//       return response
//     } else { return response.data }
//   }).catch((error) => {
//     console.log(error)
//   })
// }
//
// export function changeThumb (store, {mediaId, userId}) {
//   let data = {media_id: mediaId}
//   return rev.put('users/' + userId, data).then((response) => {
//     if (response.data.success === true) {
//       store.commit(types.CHANGE_THUMB, mediaId)
//       store.dispatch('setFlash', {message: 'Votre photo de profil a bien été modifié !'})
//       return response.data.data
//     }
//   })
// }
