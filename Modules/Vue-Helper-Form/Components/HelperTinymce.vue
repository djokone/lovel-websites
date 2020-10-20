<style scoped>
  @import '../tinymce/skins/lightgray/skin.min.css';
  @import '../tinymce/skins/lightgray/content.min.css';
</style>
<template>
  <div class="mytinymce">
    <textarea v-model="init" :id="'tinymce'+id">
    </textarea>
  </div>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import 'tinymce/themes/modern/theme'

  import 'tinymce/plugins/paste/plugin'
  import 'tinymce/plugins/link/plugin'
  import 'tinymce/plugins/autoresize/plugin'
  import 'tinymce/plugins/advlist/plugin'
  import 'tinymce/plugins/autolink/plugin'
  import 'tinymce/plugins/lists/plugin'
  import 'tinymce/plugins/image/plugin'
  import 'tinymce/plugins/charmap/plugin'
  import 'tinymce/plugins/print/plugin'
  import 'tinymce/plugins/preview/plugin'
  import 'tinymce/plugins/anchor/plugin'
  import 'tinymce/plugins/searchreplace/plugin'
  import 'tinymce/plugins/visualblocks/plugin'
  import 'tinymce/plugins/code/plugin'
  import 'tinymce/plugins/fullscreen/plugin'
  import 'tinymce/plugins/insertdatetime/plugin'
  import 'tinymce/plugins/media/plugin'
  import 'tinymce/plugins/table/plugin'
  import 'tinymce/plugins/contextmenu/plugin'
  import '@/tinymce/langage/fr_FR'
  // import idSysteme from '../Resources/store'
  import _ from 'lodash'

  export default ({
    props: ['init', 'disabled'],
    data () {
      return {
        id: this._uid,
        tinymce: false,
        tinyId: false
      }
    },
    // methods: {
    //   updateValue (value) {
    //     this.$emit('input', value.trim())
    //   }
    // },
    // Comment to take off the parse error
    watch: {
      init (val, oldVal) {
        let vm = this
        if (_.isEmpty(oldVal) && !_.isEmpty(val)) {
          let editor = tinymce.get('tinymce' + vm.id)
          editor.setContent(val)
        }
        console.log('init end')
      }
    },
    update () {
      let vm = this
      if (vm.init) {
        let editor = tinymce.get('tinymce' + vm.id)
        editor.setContent(vm.init)
      }
    },
    mounted () {
      let vm = this
      this.tinymce = tinymce.init({
        skin: false,
        height: 500,
        selector: '#tinymce' + vm.id,
        // target: this.$el.children[0],
        themes: 'modern',
        menubar: false,
        language: 'fr_FR',
        language_url: false,
        setup: function (editor) {
          editor.settings.readonly = vm.disabled
          editor.on('init', function (e) {
            editor.setContent(vm.init)
            this.getDoc().body.style.fontSize = '12'
            this.getDoc().body.style.fontFamily = 'Montserrat'
          })
          if (!vm.disabled) {
            editor.on('keyup', function (e) {
              // console.log(editor.getContent())
              let newContent = editor.getContent()
              vm.$emit('isUpdate', newContent)
              // vm.updateValue(editor.getContent())
            })
          }
        },
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table contextmenu paste code'
        ],
        toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code'
        // skin_url: '/css/mytinymceskin'
        // themes: 'modern'
      })
    }
  })
</script>