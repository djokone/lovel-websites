let loadContent = {
  data () {
    return {
      loaded: {},
      promise: {},
      isLoaded: false
    }
  },
  async created () {
    try {
      this.loaded = await this.loadContent()
      this.isLoaded = true
    } catch (e) {
      console.error(e)
    }
  },
  computed: {
  },
  methods: {
    async loadContent () {
      console.log('add the content to load in loadContent() method')
      return false
    },
    async load (name = false, data = false) {
      console.log(this)
      if (name) {
        if (data) {
          this.promise[name] = this[name](data)
        } else {
          this.promise[name] = this[name]()
        }
      } else {
        this.promise = this[name](data)
      }
      return this.promise
    }
  }
}

export default loadContent
