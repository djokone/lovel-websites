<script>
  import { isEmpty } from 'lodash'
  import inputDispatcher from '../lib/InputUtils'
  // import tinymce from 'tinymce'

  export default({
    render (h) {
      return inputDispatcher(this, h)
    },
    data () {
      return {
        primary: this._uid,
        localData: this.value
      }
    },
    props: {
      name: {
        type: [String]
      },
      options: {
        default: false
      },
      value: {
        required: false,
        default: ''
      },
      label: {
        default: 'name'
      },
      disabled: {
        default: false
      },
      component: {
        default: false,
        type: [Object, Boolean]
      },
      type: {
        default: 'text'
      },
      placeholder: {
        default: 'Put your text here !'
      }
    },
    methods: {
      upLocal (val) {
        this.$set(this, 'localData', val)
      }
    },
    computed: {
      getValue () {
        return this.value
      },
      isPassword () {
        return this.type === 'password'
      },
      isInput () {
        return this.type === 'text'
      },
      isTextarea () {
        return this.type === 'textarea'
      },
      isTinymce () {
        return this.type === 'tinymce'
      },
      classError () {
        if (this.getError) {
          return 'hasError'
        }
      },
      mylabel () {
        if (this.label) {
          return this.label
        } else {
          return this.name
        }
      },
      getError () {
        if (!isEmpty(this.localErrors)) {
          return this.localErrors
        } else {
          return false
        }
      }
    },
    watch: {
      value (newVal) {
        this.$set(this, 'localData', newVal)
        // this.localData = cloneDeep(newVal)
      }
    },
    components: {
      // tinymce
    }
  })
</script>
