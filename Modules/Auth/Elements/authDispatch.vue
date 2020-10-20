<template>
  <div class="auth__dispatch">
    <slot v-if='isAuthorize'>
    </slot>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'

  // import authSession from '/auth.js'
  export default({
    name: 'authDispatch',
    props: {
      conditions: {
        type: Array
      },
      isNot: {
        default: false,
        type: Boolean
      }
    },
    computed: {
      ...mapGetters({
        role: 'role'
      }),
      isAuthorize () {
        let authorize = false
        this.conditions.forEach((value) => {
          let verif
          if (this.isNot) {
            verif = value !== this.role
          } else {
            verif = value === this.role
          }
          if (verif) {
            authorize = true
            return true
          }
        })
        // } else {
        //   return false
        // }
        return authorize
      }
    }
  })
</script>
