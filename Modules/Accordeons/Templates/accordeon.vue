<template>
  <div class="accordeon">
    <slot></slot>
  </div>
</template>

<script>
  import { forEach } from 'lodash'
  export default ({
    data () {
      return {
        items: []
      }
    },
    props: {
      toogle: {
        default: true
      }
    },
    mounted () {
      this.items = this.$children
      this.items[0].isActive = true
      // this.$children.on('changeActive', this.change)
      // _.forEach(this.items, (v, k) => {
      //   v.on('changeActive', this.change)
      // })
    },
    methods: {
      change (id) {
        forEach(this.items, function (v, k) {
          if (v._uid !== id) {
            v.isActive = false
          }
        })
      }
    }
  })
</script>