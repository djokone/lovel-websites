import * as types from './mutation-types'
import * as actions from './actions'
import * as getters from './getters'

const state = {
  notifications: []
}

const mutations = {
  [types.SAVE_NOTIF] (state, notif) {
    notif['id'] = state.notifications.length
    state.notifications.push(notif)
  },
  [types.REMOVE_NOTIF] (state, id) {
    state.notifications = state.notifications.filter((v) => {
      return v.id !== id
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
