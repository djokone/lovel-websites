import * as types from './mutation-types'

/*
Users
*/
export function changeEtat (store, data) {
  return new Promise((resolve, reject) => {
    store.dispatch(types.CHANGE_STATE, data)
  })
}
