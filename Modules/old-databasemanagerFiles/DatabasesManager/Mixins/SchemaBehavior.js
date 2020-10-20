import ModelBehavior from './ModelBehavior'
const SchemaBehavior = {
  props: {
  },
  data () {
    return {
    }
  },
  created () {
    this.initSchemaBehavior()
  },
  mixins: [ModelBehavior],
  methods: {
    initSchemaBehavior () {
      if (this.Model) {
        console.log('Pret')
        console.log(this.Model)
      } else {
        throw new Error('"Model" property is not in ' + this.$options.name + ' component, add it before using schema behavior')
      }
    },
    hasParent (field) {
      return field.parent
    }
    // RelationType (field) {
    //   if ()
    // }
  },
  computed: {
    ModelFields () {
      return this.Model.getFields()
    },
    ModelFieldsArray () {
      let Field = []
      for (let f in this.ModelFields) {
        let field = {
          name: f,
          ...this.ModelFields[f]
        }
        Field.push(field)
      }
      return Field
    },
    FieldsWithForeignKey () {
      return this.ModelFieldsArray.filter(v => {
        return v.foreignKey
      })
    },
    FieldsWithoutForeignKey () {
      return this.ModelFieldsArray.filter(v => {
        return !this.ForeignKeys.includes(v.name)
      })
    },
    ForeignKeys () {
      return this.FieldsWithForeignKey.map(k => {
        return k.foreignKey
      })
    }
  },
  watch: {
  }
}
export default SchemaBehavior
