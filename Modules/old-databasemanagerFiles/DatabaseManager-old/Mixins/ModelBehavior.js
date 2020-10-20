const ModelBehavior = {
  props: {
    model: {
      type: [Function, Boolean],
      default: false
    }
  },
  data () {
    return {
      ModelBehavior: {
        model: false
      }
    }
  },
  created () {
    this.initModelBehavior()
  },
  methods: {
    initModelBehavior () {
      if (this.model !== false) {
        this.ModelBehavior.model = this.model
      }
      if (typeof this.$options.model === 'function') {
        this.ModelBehavior.model = this.$options.model
      }
    }
  },
  computed: {
    Collection () {
      return this.Model.entity || false
    },
    Model () {
      return this.ModelBehavior.model
    }
  },
  watch: {
    model () {
      if (this.model !== false) {
        this.ModelBehavior.model = this.model
      }
    }
  }
}
export default ModelBehavior
