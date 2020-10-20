// import {mapActions} from 'vuex'

const LoadCurrentDatabase = {
  data () {
    return {
      LoadDatabase: {
        isLoad: false,
        isLoading: true
      }
    }
  },
  created () {
    this.init()
    this.loadData()
  },
  computed: {
    debug () {
      return this.$store.getters.debug
    },
    database () {
      return this.$store.getters.currentDatabaseId
    },
    __actions () {
      return this.LoadDatabase.actions
    },
    getters () {
      let getters = {}
      for (let getter of this.LoadDatabase.getters) {
        let queryPath = this.database + '/' + getter + '/query'
        // console.log(queryPath)
        let query = this.$store.getters[queryPath]()
        getters[getter] = query.get()
      }
      return getters
    }
  },
  watch: {
    // getters () {
    //   console.log('change value')
    //   // console.log()
    //   for (let k of this.getters) {
    //     console.log(k)
    //     // console.log(val)
    //   }
    // }
  },
  methods: {
    init () {
      // init load options
      let toLoad = []
      let getters = []
      if (Array.isArray(this.$options.load)) {
        toLoad = this.$options.load
      } else {
        toLoad = this.$options.load.actions
      }
      if (this.$options.load.getters) {
        getters = this.$options.load.getters
      }
      this.LoadDatabase = {
        ...this.LoadDatabase,
        getters: [...getters],
        actions: [...toLoad]
      }
    },
    async loadData () {
      this.isLoading = true
      this.isLoad = false
      for (let actions of this.__actions) {
        await this.$store.dispatch(actions, {
          verbose: this.debug
        })
        this.isLoading = false
        // console.log(actions)
      }
    }
  }
}

export default LoadCurrentDatabase
