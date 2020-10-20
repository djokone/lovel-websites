import * as firebase from 'nativescript-plugin-firebase'
import {
    log
} from '@/libs/Verbose'
import {
    clone
} from 'lodash'

import {
    getText
} from './Feeback'
import {
    Color
} from 'tns-core-modules/color'

var feedback = new Feedback()

const config = {
  error: {
    bgColor: new Color('#FF2F38')
  }
}

export async function FirebaseLogin ({
    dispatch
}, {
    username,
    password
}) {
  try {
    log('get')
    let auth = await firebase.login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email: username.trim(),
        password: password
      }
    })
    dispatch('login', auth)
  } catch (error) {
    throw error
  }
}
/**
 * Get the current logged user throw firebase authentification
 * @param {*} Store
 * @param {*} firestore
 */
export async function getCurrentUserFirebase ({
    dispatch
}, firestore = false) {
  let currentUser = firebase.getCurrentUser()
  if (firestore) {
    let auth = await dispatch('syncWithAuthCollection', currentUser.uid)
    dispatch('login', auth)
    currentUser = {
      currentUser,
      auth
    }
    console.log('Auth from dispatch')
    console.log(currentUser)
  }
  return currentUser
}

export async function syncWithAuthCollection ({
    dispatch
}, uid) {
  log('Sync auth with firebase')
  try {
    let authCollection = firebase.firestore.collection('auth')
    let auth = await authCollection.doc(uid).get()
    console.log(auth.data())
    dispatch('entities/auths/update', {
      where: uid,
      data: auth.data()
    })
    return auth.data()
  } catch (e) {
    console.log(e)
  }
}

export async function login ({
    dispatch
}, user) {
  log('Login')
  log('sync with auth collection')
  dispatch('syncWithAuthCollection', user.uid)
  log('sync with user collection')
  dispatch('syncWithUserCollection', user.uid)
  log('Add auth user in store')
  dispatch('entities/auth/create', {
    data: user
  })
}

export async function updateProfileFirebase ({
    dispatch
}, data) {
  let update = await firebase.updateProfile(data)
  dispatch('updateAuth', data)
  return update
}

export async function FirebaseLogout ({
    dispatch
}) {
  let auth = await dispatch('getCurrentUserFirebase')
  await firebase.logout()
  dispatch('logout', auth.uid)
}

export async function logout ({
    dispatch
}, uid = false) {
  if (uid === false) {
    dispatch('entities/auths/deleteAll')
  } else {
    dispatch('entities/auths/delete', {
      where (record) {
        return record.uid === uid
      }
    })
  }
}

export async function changePasswordFirebase ({}, datas) {
  console.log(datas)
  datas = clone(datas)
  try {
    let auth = await firebase.changePassword(datas)
    let success = getText('changePassword', 'Votre mot de passe à bien été modifié', 'success')
    feedback.success(success)
    return auth
  } catch (errorMessage) {
    feedback.error(getText('ChangePassword', errorMessage))
    throw errorMessage
  }
}
