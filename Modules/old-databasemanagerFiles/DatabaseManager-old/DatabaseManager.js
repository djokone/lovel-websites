import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export default class DatabaseManager {
  static $databasesConfigs = []
  static $databases = {}
  static $firestore = {}
  static $auth = {}
  static currentDatabaseId = ''
  static currentAuthDatabase = ''
  constructor () {
    this.instance
  }
  static instantiate () {
    this.instance = new DatabaseManager()
  }
  static addDatabase (database, options = {defaultDatabase: false, defaultAuthDatabase: false}) {
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
    return this.$databasesConfigs.find((d) => {
      return d.projectId === that.currentDatabaseId
    })
  }
  static initialize (enablePersistence = false) {
    let settings = {
      // timestampsInSnapshots: true
    }
    for (let database of this.$databasesConfigs) {
      if (this.currentDatabaseId === database.projectId) {
        this.$databases[database.projectId] = firebase.initializeApp(database)
      } else {
        this.$databases[database.projectId] = firebase.initializeApp(database, database.projectId)
      }
      this.$firestore[database.projectId] = this.$databases[database.projectId].firestore()
      this.$firestore[database.projectId].settings(settings)
      if (enablePersistence) {
        this.$firestore[database.projectId].enablePersistence()
      }
      this.$auth[database.projectId] = this.$databases[database.projectId].auth()
      console.log('Database ' + database.projectId + ' is initialize')
    }
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
    return this.currentDatabaseId
  }
  static changeCurrentId (val) {
    this.currentDatabaseId = val
  }
}
