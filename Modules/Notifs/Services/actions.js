import * as types from './mutation-types'

export function setFlash (store, {message, type}) {
  return new Promise((resolve, reject) => {
    if (type === undefined) {
      type = 'success'
    }
    let notif = {
      type: type,
      message: message,
      created: new Date()
    }
    store.commit(types.SAVE_NOTIF, notif)
  })
}

export function closeNotif (store, {id, timeSet}) {
  timeSet = timeSet || 300
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      store.commit(types.REMOVE_NOTIF, id)
    }, timeSet)
  })
}

/*
Users
*/
// export function login (store, data) {
//   return this.$resource('http://localhost/Cakephp3/imperial/api/users/token.json').save(data).then((response) => {
//     if (response.data.success) {
//       store.dispatch(types.SAVE_AUTH, response.data.data.token)
//       return response
//     } else {
//       return false
//     }
//   }, (response) => {
//     return response
//   })
// }

// export function saveAuth (store, token) {
//   return new Promise((resolve, reject) => {
//     store.dispatch(types.SAVE_AUTH, token)
//     return resolve
//   })
// }

// export function logout (store) {
//   return new Promise((resolve, reject) => {
//     store.dispatch(types.LOGOUT)
//     return resolve()
//   })
// }
