import * as actions from './actions'
import databases from '../DatabaseManager'

const state = {
  currentDatabaseId: databases.currentDatabaseId,
  debug: true
}

const mutations = {
  changeCurrentDatabase (state, newVal) {
    state.currentDatabaseId = newVal
  },
  toogleDebug (state, newVal) {
    state.debug = !state.debug
  }
}

const getters = {
  currentDatabaseId: state => {
    return state.currentDatabaseId
  },
  debug: state => {
    return state.debug
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
