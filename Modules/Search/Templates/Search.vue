<template>
  <el-row class="search">
    <!--<h2 class="title">Filtrer :</h2>-->
    <el-row :gutter="0">
      <h2 class="title" v-if="!hasFilters && !isSearching">
        Rechercher des {{displayEntityName}} :
      </h2>
      <p class="title" v-if="isEdit">
        <span v-if="isSearching">
          Recherche "{{SearchRequest}}"
        </span>
        <span v-if="hasFilters && !isSearching">
          <span v-if="hasFilters && isSearching">f</span>
          <span v-else>F</span>iltré par
          <span v-for="(filter, i) in returnFilters" :key="i">
            <span v-if="returnFilters.length > 1 && i === returnFilters.length-1">
              et
            </span>
             {{getDisplayName(filter.model.name)}}
          </span>
        </span>
        <span class="result">
          <span class="small-title success" v-if="results.length">{{results.length}} {{pluralize(displayEntityName, results.length)}} {{pluralize('trouvés', results.length)}}</span>
          <span class="small-title error" v-if="!results.length">Aucun résultat</span>
        </span>

      </p>

      <el-input
        size="medium"
        placeholder="Que cherches-tu mon enfant ?"
        v-model="SearchRequest"
        class="input-with-select">
        <el-select
          multiple
          filterable
          collapse-tags
          v-model="SearchFields"
          slot="prepend"
          placeholder="Champs de recherche"
          style="width: 200px;"
          @change="changeParam"
        >
          <el-option v-for="field in withoutParents"
                     :label="field.name"
                     :value="field.name"
                     :key="field.name"
          >
          </el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" v-if="!isSearching"></el-button>
        <el-button slot="append" icon="el-icon-close" v-if="isSearching" @click="resetTerm"></el-button>
      </el-input>
    </el-row>
    <!-- Filters Form -->
    <el-row v-if="!isSearching">
      <el-form
        label-position="right"
      >
        <el-form-item style="width: 100%">
          <el-row :gutter="10">
            <el-col v-for="(parent, key) in parents" v-if="parentsValue && parentsValue[key]" :span="12" :key="key">
              <el-select
                size="mini"
                clearable
                filterable
                multiple
                :collapse-tags="SearchFilters[key] && SearchFilters[key].length > 4"
                style="width: 100%"
                v-model="SearchFilters[key]"
                @change="changeFilters"
                :placeholder="'Filter par ' + parent.name"
              >
                <!--<template slot="prefix">-->
                  <!--{parent.name}-->
                <!--</template>-->
                <el-option
                  v-for="p in parentsValue[key].value"
                  :key="p.id"
                  :label="p.name"
                  :value="p.id"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
            <!--<el-select v-for="value in parentsValue"-->
              <!--slot="prepend"-->
            <!--&gt;</el-select>-->
        </el-form-item>
      </el-form>
    </el-row>
  </el-row>
</template>

<script>
  import pluralize from 'pluralize'
  // import { debounce } from 'lodash'
  /**
   * @vue-prop {Number} initialCounter - Initial counter's value
   * @vue-prop {Number} [step=1] - Step
   * @vue-data {Number} counter - Current counter's value
   * @vue-computed {String} message
   * @vue-event {Number} increment - Emit counter's value after increment
   * @vue-event {Number} decrement - Emit counter's value after decrement
   */
  export default {
    name: 'search',
    data () {
      return {
        SearchFilters: {},
        SearchRequest: '',
        SearchFields: ['name'],
        SearchOptions: {
          caseSensitive: false
            //   keys: this.SearchFields
        }
      }
    },
    props: {
      request: {
        default: '',
        type: String
      },
      Model: {
        type: [Object, Function]
      },
      labels: {
        default () {
          return {
          }
        },
        type: [Object]
      },
      results: {
        default () {
          return []
        },
        type: [Array]
      }
    },
    created () {
      this.initFilterList()
    },
    computed: {
      displayEntityName () {
        if (this.Model.entity && this.labels[this.Model.entity]) {
          return this.labels[this.Model.entity]
        } else {
          return this.Model.entity
        }
      },
      database () {
        return this.$store.getters.currentDatabaseId
      },
      hasFilters () {
        return this.returnFilters && this.returnFilters.length > 0
      },
      isEdit () {
        return this.hasFilters || this.isSearching
      },
      isSearching () {
        return this.SearchRequest.length
      },
      delay () {
        return this.isSearching ? 600 : 0
      },
      options () {
        return {
          keys: this.SearchFields,
          ...this.SearchOptions
        }
      },
      Fields () {
        return this.Model.getFields()
      },
      FieldsList () {
        let Field = []
        for (let f in this.Fields) {
          let field = {
            name: f,
            ...this.Fields[f]
          }
          Field.push(field)
        }
        return Field
      },
      returnFilters () {
        let res = []
        for (let filter in this.SearchFilters) {
          let entity = this.SearchFilters[filter]
          let meta = this.parentsValue[filter]
          if (entity.length > 0) {
            res.push({
              model: this.parentsValue[filter].model,
              foreignKey: meta.model.foreignKey,
              isArray: pluralize.isPlural(meta.model.foreignKey),
              value: entity
            })
          }
        }
        return res
        // return this.SearchFilters.map((v, k) => {
        //   console.log(v)
        //   console.log(k)
        // })
      },
      parentsValue () {
        let that = this
        return this.parents.map((v) => {
          let path = that.database + '/' + v.parent.entity + '/query'
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
      parents () {
        let that = this
        return this.FieldsList.filter((v) => v.parent).map((v) => {
          return {
            ...v,
            fields: that.cleanFieldsArray(that.fieldsToArray(v.parent.getFields()))
          }
        })
      },
      withoutParents () {
        return this.FieldsList.filter((f) => {
          let isLinkKey = /_id[s]*$/.test(f.name)
          return !f.parent && !isLinkKey
        })
        // let parent =
        // for (let field in this.Fields) {
        //   this.Fields[field].parent
        //   console.log(field)
        // }
        // if (this.Fields) {
        //   // let ArrayFields = [...this.Fields]
        //   // console.log(ArrayFields)
        //   // console.log(this.Fields)
        //   // return this.Fields.filter((v) => {
        //   //   console.log(v.parent)
        //   // })
        // }
      }
    },
    watch: {
      async SearchRequest () {
        this.emitSearch(this)
      },
      parents () {
        let that = this
        console.log('test')
        this.parents.forEach((v) => {
          console.log(v)
          if (!that.SearchFilters[v.name]) {
            that.SearchFilters.push(v)
          }
        })
      }
    },
    methods: {
      pluralize,
      getDisplayName (name) {
        if (this.labels[name]) {
          return this.labels[name]
        } else {
          return name
        }
      },
      resetTerm () {
        console.log('reset')
        this.SearchRequest = ''
      },
      initFilterList () {
        if (this.SearchFilters && this.SearchFilters.length) {
          this.SearchFilters.map(() => { return [] })
        }
      },
      changeFilters () {
        this.$emit('filter', this.returnFilters)
      },
      async changeParam () {
        this.emitSearch(this)
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
            ...this.Fields[f]
          }
          Field.push(field)
        }
        return Field
      },
      emitSearch () {
        this.$emit('search', this.SearchRequest, this.options)
      },
      changeSearch () {
        console.log('change search')
      },
      eachFields () {
        for (let field in this.Fields) {
          console.log(field)
        }
      }
    }
  }
</script>

<style scoped>
  .search {
    margin-top: 20px;
  }
  .success {
    color: #67C23A;
  }
  .error {
    color: #F56C6C;
  }
  .search .result {
    display: block;
    float: right;
    font-weight: bold;
    /*color: #67C23A;*/
  }
  .el-form-item {
    margin: 0px;
  }
  .search .el-row {
    margin-bottom: 10px;
  }
</style>
