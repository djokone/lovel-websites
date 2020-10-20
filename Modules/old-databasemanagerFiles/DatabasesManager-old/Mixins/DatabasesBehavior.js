import databases from '../DatabaseManager'
import {
  mapActions
} from 'vuex'
const DatabasesBehavior = {
  props: {
    currentDatabase: {
      type: [String, Boolean],
      default: false
    },
    databases: {
      type: [Array, Boolean],
      default: false
    }
  },
  data () {
    return {
      DatabasesBehavior: {
        currentDatabase: false,
        databases: false
      }
    }
  },
  created () {
    this.initDatabasesBehavior()
  },
  methods: {
    ...mapActions(['adminChangeCurrentDatabase']),
    initDatabasesBehavior () {
      if (this.currentDatabase !== false) {
        this.DatabasesBehavior.currentDatabase = this.currentDatabase
      }
      if (this.databases !== false) {
        this.DatabasesBehavior.databases = this.databases
      }
      if (typeof this.$options.currentDatabase === 'string') {
        this.DatabasesBehavior.currentDatabase = this.$options.currentDatabase
      }
      if (typeof this.$options.databases !== 'undefined' && Array.isArray(this.$options.databases)) {
        this.DatabasesBehavior.databases = this.$options.databases
      }
    },
    changeCurrentDatabase (databaseId) {
      this.adminChangeCurrentDatabase(databaseId)
    }
  },
  computed: {
    FirestoreDatabases () {
      return databases.databasesConfigs
    },
    Database () {
      if (this.DatabasesBehavior.currentDatabase === false) {
        return this.$store.getters.currentDatabaseId
      } else {
        this.DatabasesBehavior.currentDatabase
      }
    },
    Databases () {
      if (this.databases !== false && Array.isArray(this.databases) && this.databases.length) {
        return this.FirestoreDatabases.filter(v => {
          return this.databases.includes(v.projectId)
        })
      } else {
        return this.FirestoreDatabases
      }
    }
  },
  watch: {
    currentDatabase () {
      if (this.currentDatabase !== false) {
        this.DatabasesBehavior.currentDatabase = this.currentDatabase
      }
    },
    databases () {
      if (this.currentDatabase !== false) {
        this.DatabasesBehavior.databases = this.databases
      }
    }
  }
}
export default DatabasesBehavior
