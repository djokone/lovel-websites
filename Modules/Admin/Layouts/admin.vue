<style lang="scss">

</style>
<style lang="scss" src="../scss/admin.scss"></style>
<template>
  <div id="admin">
    <navbar/>
    <router-view name="options"/>
    <div id="body" :class="optionClass">
      <flashMessage/>
      <div>
        <!-- <keep-alive> -->
        <router-view/>
        <!-- </keep-alive> -->
      </div>
    </div>
  </div>
</template>

<script>
  import navbar from '@/Modules/Sidbar/Templates/adminNav'
  import flashMessage from '@/Modules/Notifs/Templates/notifications'
  // import { mapGetters } from 'vuex'
  Object.size = function (obj) {
    let size = 0
    let key
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++
    }
    return size
  }

  export default {
    name: 'AdminLayout',
    components: {
      navbar,
      flashMessage
    },
    data () {
      return {
        hasOption: 0
      }
    },
    mounted () {
      this.hasOptions()
    },
    watch: {
      '$route': 'hasOptions'
    },
    methods: {
      hasOptions () {
        let sidbar = this.$route.matched[0].components.valueOf()
        let length = Object.size(sidbar)
        this.hasOption = length
        return length
      }
    },
    computed: {
      optionClass () {
        if (this.hasOption === 2) {
          return '__got_option'
        }
      }
    }
    // beforeRouteEnter (to, from, next) {
    //   next(vm => {
    //     if (!vm.isLogged) {
    //       next('/login')
    //     }
    //   })
    // }
  }
</script>
