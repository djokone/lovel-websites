import axios from 'axios'

function ExeptionServerRequest (message) {
  this.message = message
  this.name = 'ExeptionServerRequest'
}

class Server {
  constructor (config) {
    // console.log('initServer')
    this.defaultConfig = {
      'server': process.env.SERVEUR,
      // 'server': 'https://lovel.app',
      'engineOptions': {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      },
      'requestEngine': 'Axios'
    }
    this._engine = {}
    this.config = {}
    this.setConfig(config)
    let conf = this.getConfig()
    this.setEngine(conf.requestEngine)
  }

  getConfig (key = false) {
    return !key ? this.config : this.config[key] ? this.config[key] : {}
  }

  setConfig (config = {}, key = false) {
    if (key === false) {
      this.config = {...this.defaultConfig, ...this.config, ...config}
    } else {
      let confKey = this.config[key] ? this.config[key] : {}
      let confDefKey = this.defaultConfig[key] ? {...this.defaultConfig[key], ...confKey} : {}
      this.config = {...confDefKey, ...config}
    }
  }

  setEngineConfig (conf) {
    this.setConfig(conf, 'engineOptions')
  }

  getEngineConfig () {
    return this.getConfig('engineOptions')
  }

  initEngine (requestEngine) {
    if (typeof this['init' + (requestEngine)] === 'function') {
      return this['init' + (requestEngine)](this.getEngineConfig('engineOptions'))
    } else {
      throw new ExeptionServerRequest('init' + (requestEngine) + ' function does\'nt exist in your Server Instance, you can use Axios instead')
    }
  }

  initAxios (options) {
    let conf = this.getEngineConfig()
    conf.baseURL = conf.baseURL ? conf.baseURL : this.getConfig('server')
    return axios.create(conf)
  }

  setEngine (requestEngine) {
    this._engine = this.initEngine(requestEngine)
  }

  get engine () {
    return this.getEngine()
  }

  getEngine () {
    return this._engine
  }
}

export default Server
