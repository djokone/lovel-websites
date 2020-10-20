/* global localStorage */
/* eslint no-undef: "error" */
// import {
//   // firebaseLovelCloud
//   // auth
// } from '@/config/firebaseLovelCloud'
// import jwtDecode from 'jwt-decode'
import {
  isEmpty
  // find
} from 'lodash'

const localStorage = window.localStorage
// import { api } from './resources'
// import config from '/bootstrap'
// const auth = firebaseLovelCloud.auth()

export default class Auth {
  constructor (options = {}, debug = false) {
    this.storage = localStorage
    // this.errors
    this.debug = debug
    this.data = {}
    this.defaultOptions = {
      expirate: false,
      authentication: 'basic',
      require: 'all',
      data: {
        login: 'login',
        role: 'role'
      }
    }
    this.setOptions(options)
    if (this.debug) {
      console.log('l\'objet auth est construit')
    }
    if (this.isLogged()) {
      this.token = this.storage.getItem('token')
      this.sub = this.storage.getItem('sub')
    }
  }
  setOptions (options) {
    this.options = {...this.defaultOptions, ...options}
  }
  getOptions (key = false) {
    if (key !== false) {
      return this.options[key]
    } else {
      return this.options
    }
  }

  login (data = {}) {
    if (!this.isLogged()) {
      if (typeof this[this.getOptions('authentication') + 'Log'] === 'function') {
        this[this.getOptions('authentication') + 'Log'](data)
      }
    }
  }

  basicLog (data = {}) {
    let options = this.getOptions('data')
    for (let option in options) {
      this.saveData(option, data[option])
    }
    // this.getOptions('data').forEach((v, k) => this.saveData(v, k))
  }
  jwtLog () {
    // let jwtDecode = require('jwt-decode')
    // this.saveData({token: token})
    // let tokenDecode = jwtDecode(token)
    // this.save(tokenDecode)
  }

  isLogged () {
    if (this.getOptions('authentication') === 'firebase') {
      // auth()
    }
    let isLog = this.storage.getItem(this.getOptions('data').login)
    if (isLog) {
      if (this.isExpirate()) {
        this.logout()
        return false
      } else {
        return true
      }
    }
    return false
  }

  isExpirate () {
    return this.getOptions('expirate') === false ? false : this.storage.getItem('exp') < Date.now() / 1000
  }
  getData () {
    if (isEmpty(this.data)) {
      this.data = this.getStorageData()
    }
    return this.data
  }
  getStorageData () {
    let res = {}
    let options = this.getOptions('data')
    console.log(options)
    for (let option in options) {
      res[option] = this.storage.getItem(option)
    }
    return res
  }

  getOptionsData (key = false) {
    return typeof key === 'string' ? this.getOptions('data')[key] : this.getOptions('data')
  }

  getToken () {
    this.token = this.storage.getItem('token')
    if (!isEmpty(this.storage.getItem('token'))) {
      return this.storage.getItem('token')
    }
  }
  // saveOptionsData () {
  //   let options = this.getOptions('data')
  //   for (let option in options) {
  //     this.saveData(option, setData[option])
  //   }
  // }

  saveData (data, value) {
    if (typeof data === 'object') {
      this.data = data
      data.forEach((v, k) => {
        this.storage.setItem(k, v)
      })
      return data
    } else if (typeof data === 'string' && value) {
      this.data[data] = value
      this.storage.setItem(data, value)
      let res = {}
      res[data] = value
      return res
    }
  }

  logout () {
    this.storage.clear()
  }

  // _sendRequest (data) {
  //   console.log(process.env.CONFIG.SERVEUR + '/users/token.json')
  //   return api.post('/users/token.json', data).then((response) => {
  //     if (response.data.success) {
  //       this.token = response.data.data.token
  //       return response.data.data.token
  //     } else {
  //       return false
  //     }
  //   }, (response) => {
  //     console.log(response)
  //   }).catch(function (error) {
  //     console.log(error)
  //   })
  // }
}
