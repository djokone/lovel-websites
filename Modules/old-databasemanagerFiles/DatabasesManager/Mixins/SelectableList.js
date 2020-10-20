const SelectableList = {
  data () {
    return {
      SelectableBehavior: {
        settings: {
          ref: 'EntitiesList',
          toogleMethod: 'toggleRowSelection',
          resultKey: 'data'
        },
        currentSelection: [],
        allSelection: []
      }
    }
  },
  props: {
    selectionMode: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.initSettings()
    if (!this[this.SelectableBehaviorSettings.resultKey]) {
      console.error('"' + this.SelectableBehaviorSettings.resultKey + '" property doesn\'t exist in ' + this.$options.name + ' component file at "' + this.$options.__file + '" path')
    }
  },
  mounted () {
    if (!this.ListRef) {
      console.error('"#' + this.SelectableBehaviorSettings.ref + '" reference doesn\'t exist in ' + this.$options.name + ' component file at "' + this.$options.__file + '" path')
    }
  },
  computed: {
    SelectableBehaviorSettings () {
      return this.SelectableBehavior.settings
    },
    ListRef () {
      return this.$refs[this.SelectableBehaviorSettings.ref] || false
    },
    newCurrentSelection () {
      if (this[this.SelectableBehaviorSettings.resultKey]) {
        return this[this.SelectableBehaviorSettings.resultKey].filter(f => {
          return this.SelectableBehavior.allSelection.find(r => {
            return r.id === f.id
          })
        })
      }
      return []
    }
  },
  watch: {
    newCurrentSelection (val) {
      console.log(val)
      if (typeof this.ListRef[this.SelectableBehaviorSettings.toogleMethod] === 'function') {
        val.forEach(v => {
          this.ListRef[this.SelectableBehaviorSettings.toogleMethod](v, true)
        })
      }
    }
  },
  methods: {
    initSettings () {
      let settings = this.$options.selectable
      if (settings) {
        for (let setting in settings) {
          this.$set(this.SelectableBehavior.settings, setting, settings[setting])
        }
        this.SelectableBehavior.settings = {...this.SelectableBehavior.settings, ...this.$options.selectable}
      }
    },
    async onSelectionChange (val) {
      let isRemove = this.SelectableBehavior.currentSelection.length > val.length
      this.SelectableBehavior.currentSelection = val
      if (this.SelectableBehavior.allSelection.length && !isRemove) {
        this.mergeInAllSelection(val)
      } else if (isRemove) {
        this.SelectableBehavior.allSelection = this.SelectableBehavior.allSelection.filter(v => {
          return val.find(f => {
            return f.id === v.id
          })
        })
      } else {
        this.SelectableBehavior.allSelection = val
      }
      this.$emit('changeSelection', this.SelectableBehavior.allSelection)
    },
    mergeInAllSelection (val) {
      let newSelection = val.filter(v => {
        return !this.SelectableBehavior.allSelection.find(r => {
          return v.id === r.id
        })
      })
      this.SelectableBehavior.allSelection = [...this.SelectableBehavior.allSelection, ...newSelection]
    }
  }
}

export default SelectableList
