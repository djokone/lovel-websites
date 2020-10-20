<template>
    <div ref="embed" class="typeform">
    </div>
</template>

<script>
  import * as typeformEmbed from '@typeform/embed'

  export default {
    name: 'profil-typeform',
    props: {
      url: String,
      mode: {
        default: 'widget'
      }
    },
    mounted () {
      let that = this
      let options = {
        autoOpen: true,
        hideFooter: true,
        hideHeaders: true,
        hideScrollbars: true,
        opacity: 0,
        onSubmit: function () {
          that.$emit('submit')
        }
      }
      if (this.mode === 'widget') {
        this.widget(options)
      } else {
        this.popup(this.mode === 'popup')
      }
    },
    computed: {
    },
    methods: {
      popup (options) {
        typeformEmbed.makePopup()
      },
      widget (options) {
        typeformEmbed.makeWidget(this.$refs['embed'], 'https://franoisdechiara.typeform.com/to/GEFc3m', options)
      }
    }
  }
</script>

<style scoped>
</style>