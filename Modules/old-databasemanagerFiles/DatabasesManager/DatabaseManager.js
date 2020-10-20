export default class DatabaseManager {
  static $databasesConfigs = []
  static $databases = {}
  static firebase
  static $firestore = {}
  static $auth = {}
  static currentDatabaseId = ''
  static currentAuthDatabase = ''
  static addDatabase (
    database,
    options = { defaultDatabase: false, defaultAuthDatabase: false }
  ) {
    // if (!this.$databasesConfigs) {
    //   this.$databasesConfigs = []
    // }
    if (this.$databasesConfigs.length === 0) {
      this.currentDatabaseId = database.projectId
      this.currentAuthDatabase = database.projectId
    } else if (options.defaultDatabase) {
      this.currentDatabaseId = database.projectId
    }
    if (options.defaultAuthDatabase) {
      this.currentAuthDatabase = database.projectId
    }
    this.$databasesConfigs.push(database)
  }
  static get databaseConfig () {
    return this.getCurrentDatabaseConfig()
  }
  static get databasesConfigs () {
    return this.$databasesConfigs
  }
  static getCurrentDatabaseConfig () {
    let that = this
    return this.$databasesConfigs.find(d => {
      return d.projectId === that.currentDatabaseId
    })
  }
  /**
   * Initiate logger class
   * @params Logger - Logger Class to initialize
   */
  static initLogger (Logger) {
    this.Logger = Logger
    this.loggerInitiated = true
  }
  static initSDK (firebaseSdk) {
    this.firebase = firebaseSdk
  }
  static initDatabase ({
    type = 'web',
    projectId = 'entities',
    database = false,
    enablePersistence = false,
    bucket = false
  }) {
    let settings = {
      // timestampsInSnapshots: true
    }
    let namespace = projectId
    if (database.projectId) {
      namespace = database.projectId
    }
    if (type === 'nativescript') {
      // let firebaseApp = require('nativescript-plugin-firebase/app')
      this.$databases[namespace] = this.firebase.init({
        persist: enablePersistence,
        bucket
      })
      this.$firestore[namespace] = this.firebase.firestore
    } else if (this.currentDatabaseId === namespace) {
      this.$databases[namespace] = this.firebase.initializeApp(database)
      this.$firestore[namespace] = this.$databases[namespace].firestore()
      this.$firestore[namespace].settings(settings)
      this.$auth[namespace] = this.$databases[namespace].auth()
      if (enablePersistence) {
        this.$firestore[namespace].enablePersistence()
      }
    } else {
      this.$databases[namespace] = this.firebase.initializeApp(
        database,
        namespace
      )
      this.$firestore[namespace] = this.$databases[namespace].firestore()
      this.$firestore[namespace].settings(settings)
      this.$auth[namespace] = this.$databases[namespace].auth()
    }
    console.log('Database ' + namespace + ' is initialize with persistence to : ' + enablePersistence)
    return this.$databases[namespace]
  }
  static initialize ({
    // enablePersistence = false,
    type = 'web',
    bucket = ''
  }) {
    let firebase
    // this.initSDK(type)
    if (type === 'nativescript') {
      firebase = this.initDatabase({ type, projectId: 'entities', bucket })
    } else {
      for (let database of this.$databasesConfigs) {
        if (!firebase) {
          firebase = this.initDatabase({
            type,
            projectId: database.projectId,
            database
          })
        } else {
          this.initDatabase({ type, projectId: database.projectId, database })
        }
      }
    }
    return firebase
  }
  static get firestores () {
    return this.$firestore
  }
  static get firestore () {
    let database = this.currentDatabaseId
    return this.$firestore[database]
  }
  static get auth () {
    let database = this.currentDatabaseId
    return this.$auth[database]
  }
  static get currentId () {
    if (!this.currentDatabaseId) {
      this.currentDatabaseId = 'entities'
    }
    return this.currentDatabaseId
  }
  static changeCurrentId (val) {
    this.currentDatabaseId = val
  }
}
