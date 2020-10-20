import {CHANGE_STATE} from './mutation-types'
import * as actions from './actions'
import * as getters from './getters'
const state = {
  etat: '',
  boolean: false
}

const mutations = {
  [CHANGE_STATE] (state, data) {
    state.boolean = data
    if (data) {
      state.etat = 'open'
    } else {
      state.etat = 'close'
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
