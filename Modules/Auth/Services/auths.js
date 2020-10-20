import * as types from './mutation-types'
// import jwtDecode from 'jwt-decode'
import * as actions from './actions'
import * as getters from './getters'

const state = {
  data: {
    id: '',
    exp: '',
    role: ''
  },
  errors: {},
  user: {},
  isLoaded: false,
  isLogged: false
}

const mutations = {
  [types.SAVE_ERRORS] (state, errors) {
    state.errors = errors
  },
  [types.RESET_ERRORS] (state) {
    state.errors = {}
  },
  [types.SAVE_AUTH] (state, data) {
    console.log(data)
    // let data = jwtDecode(token)
    // state.data.exp = data.exp
    // state.data.id = data.sub
    // state.data.role = data.role
    state.isLogged = true
  },
  [types.LOGOUT] (state) {
    state.isLogged = false
    state.data.role = ''
  },
  [types.SAVE_USER] (state, data) {
    state.user = data
    state.isLoaded = true
  },
  [types.ADD_IMG] (state, data) {
    state.user.media.push(data)
  },
  [types.DEL_IMG] (state, id) {
    state.user.media.filter((element, k) => {
      if (element.id === id) {
        state.user.media.splice(k, 1)
        // state.user.media = state.user.media.slice(k, 1)
      }
    })
  },
  [types.CHANGE_THUMB] (state, mediaId) {
    state.user.media_id = mediaId
    state.user.thumb = state.user.media.find((e) => {
      return e.id === mediaId
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
