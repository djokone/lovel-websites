// import { user } from '/store/resources'
import {
  lovelAppPhpServer
} from '@/config/PhpResourcesServer'
// console.log(lovelAppPhpServer)
let user = lovelAppPhpServer.engine
// console.log(user)

export async function subscribe (store, data) {
  console.log('>> subscribe >>')
  if (typeof data.config === 'undefined') {
    data.config = {}
    if (typeof data.config.notif === 'undefined') {
      data.config['notif'] = true
    }
  }
  return user.post('users/subscribe', data.data).then((response) => {
    return response.data
  }).catch((error) => {
    console.log(error.response)
    let message = error.response.data.data.errors.mail._isUnique
    if (data.config.notif) {
      store.dispatch(
        'setFlash', {
          message,
          type: 'error'
        }
      )
    }
    return Promise.reject(error.response.data)
    // console.log(error.response.data)
  })
}

export async function InsertSubscriptions ({dispatch}, params = {}) {
  console.log(params)
  try {
    console.log(lovelAppPhpServer)
    let res = await user.get('/users.json', {
      params
    })
    if (res.data.success) {
      dispatch('entities/subscriptions/insert', {
        data: res.data.data
      })
    }
    return res
  } catch (e) {
    return e
  }
}
