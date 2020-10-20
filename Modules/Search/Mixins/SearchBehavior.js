// import DatabaseManager from '@/Modules/DatabasesManager/DatabaseManager'
import {
  debounce
} from 'lodash'

/**
 * Use this mixin to inject search behavior to your component
 *
 * @mixin
 */
const SearchBehavior = {
  data () {
    return {
      SearchBehavior: {
        ignoreParents: [],
        filters: [],
        search: {
          options: {},
          term: ''
        },
        filterDelay: 600
      }
    }
  },
  computed: {
    __database () {
      if (this.SearchBehavior.database) {
        return this.SearchBehavior.database
      } else {
        return this.$store.getters.currentDatabaseId
      }
    },
    Model () {
      return this.SearchBehavior.model
    },
    isSearching () {
      return this.SearchBehavior.search.term !== ''
    },
    collection () {
      if (typeof this.SearchBehavior.model === 'function') {
        return this.SearchBehavior.model.entity
      } else {
        return this.SearchBehavior.model
      }
    },
    __debug () {
      return this.$store.getters.debug
    },
    __Fields () {
      return this.SearchBehavior.model.getFields()
    },
    __FieldsList () {
      let Field = []
      for (let f in this.__Fields) {
        let field = {
          name: f,
          ...this.__Fields[f]
        }
        Field.push(field)
      }
      return Field
    },
    __parentsValue () {
      let that = this
      return this.__parents.map((v) => {
        let path = that.__database + '/' + v.parent.entity + '/query'
        let query = that.$store.getters[path]
        if (typeof query === 'function') {
          return {
            model: v,
            value: query().get()
          }
        }
        return false
      })
    },
    /**
     *
     * @returns {*|{}|Uint8Array|any[]|Int32Array|Uint16Array}
     * @private
     */
    __parents () {
      let that = this
      return this.__FieldsList.filter((v) => v.parent).map((v) => {
        // console.log(v)
        return {
          ...v,
          fields: that.cleanFieldsArray(that.fieldsToArray(v.parent.getFields()))
        }
      })
    },
    /**
     * Return list of Entities filtered by the parent ignored
     * @returns {array}
     * @private
     */
    formatedParentList () {
      let that = this
      return this.__parents.filter((v) => {
        return !that.SearchBehavior.ignoreParents.includes(v.name)
      })
    },
    /**
     *
     * @private
     */
    results () {
      if (this.isLoad) {

      }
      let queryPath = this.__database + '/' + this.collection + '/query'
      if (typeof this.$store.getters[queryPath] !== 'function') {
        return false
      }
      let entity = this.$store.getters[queryPath]()
      // Add With to request
      for (let parent of this.formatedParentList) {
        entity.with(parent.name)
      }
      console.log('isSearching', this.isSearching)
      if (this.isSearching) {
        entity.search(this.SearchBehavior.search.term, this.SearchBehavior.search.options)
      }
      if (this.SearchBehavior.filters.length > 0 && !this.isSearching) {
        for (let e of this.SearchBehavior.filters) {
          if (e.isArray) {
            entity.where((record, q) => {
              let result = false
              for (let r of e.value) {
                if (record[e.foreignKey].includes(r)) {
                  result = true
                }
              }
              return result
            })
          } else {
            entity.where((_record, q) => {
              for (let i in e.value) {
                if (i) {
                  q.orWhere(e.foreignKey, e.value[i])
                } else {
                  q.orWhere(e.foreignKey, e.value[i])
                }
              }
            })
          }
        }
      }
      return entity.get()
    }
  },
  methods: {
    changeSearch (term, options) {
      this.debounceChange(this, term, options)
    },
    changeFilters (filters) {
      this.SearchBehavior.filters = filters
      // console.log(filters)
    },
    debounceChange: debounce((context, term, options) => {
      context.ModifySearch(term, options)
    }, 500),
    ModifySearch (term, options) {
      if (term && term.length === 0) {} else {
        this.SearchBehavior.search.term = term
        this.SearchBehavior.search.options = options
      }
    },
    cleanFieldsArray (fields) {
      return fields.filter((f) => {
        let isLinkKey = /_id[s]*$/.test(f.name)
        return !f.parent && !isLinkKey
      })
    },
    fieldsToArray (obj) {
      let Field = []
      for (let f in obj) {
        let field = {
          name: f,
          ...this.__Fields[f]
        }
        Field.push(field)
      }
      return Field
    }
  },
  created () {
    this.SearchBehavior = {
      ...this.SearchBehavior,
      ...this.$options.searchBehavior
    }
  }
}

export default SearchBehavior
