<template>
    <li>
        <router-link :to="link" class="__item_menu icomoon big" :class="{'router-link-active': isActive}">
            &#xe9a6
        </router-link>
    </li>
</template>

<script>
  export default {
    name: 'nav-item',
    props: {
      to: {
        type: [Object, String]
      },
      size: {
        type: String,
        default: 'big'
      },
      isActive: {
        type: Boolean,
        default: false
      },
      content: {
        type: String,
        default: ''
      },
      addClass: {
        type: Array,
        default: []
      }
    },
    computed: {
      classes () {
        let classes = {
          'router-link-active': isActive
        }
        classes[this.size] = true
        return classes
      },
      link () {
        if (typeof this.to === 'string') {
          return { name: this.to }
        } else {
          return this.to
        }
      }
    }
  }
</script>