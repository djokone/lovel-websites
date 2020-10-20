const LoadingBehavior = {
  props: {
    loading: {
      type: [String, Boolean],
      default: null
    }
  },
  data () {
    return {
      LoadingBehavior: {
        isLoading: false
      }
    }
  },
  created () {
    this.initLoadingBehavior()
  },
  methods: {
    initLoadingBehavior () {
      if (this.isLoading !== null) {
        this.LoadingBehavior.isLoading = this.isLoading
      }
    }
  },
  computed: {
    isLoading () {
      return this.LoadingBehavior.isLoading
    }
  },
  watch: {
    loading () {
      if (this.isLoading !== null) {
        this.LoadingBehavior.isLoading = this.isLoading
      }
    }
  }
}
export default LoadingBehavior
