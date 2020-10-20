<template>
  <div>
    <h1 class="main-title">
        <span class="icomoon">&#xe9a9</span>
      Editer Game :
    </h1>
      <el-card v-if="Game">
        <div slot="header" class="clearfix">
          <span>{{Game.name}}</span>
        </div>
          <AdminGameEdit :Game="Game"></AdminGameEdit>
      </el-card>
  </div>
</template>

<script>
  import AdminGameEdit from '../Templates/AdminGameEdit'
  import { mapActions } from 'vuex'
  export default {
    name: 'adminGameEdit',
    data () {
      return {
        isLoaded: true
      }
    },
    components: {
      AdminGameEdit
    },
    created () {
      this.loadData()
    },
    methods: {
      ...mapActions(['adminLoadGame']),
      loadData () {
        this.adminLoadGame({
          id: this.$route.params.id,
          verbose: this.debug
        })
      }
    },
    computed: {
      debug () {
        return this.$store.getters.debug
      },
      databaseId () {
        return this.$store.getters['currentDatabaseId']
      },
      Game () {
        let path = this.databaseId + '/games/query'
        let query = this.$store.getters[path]
        return query()
          // .has('interests')
          // .with('interests')
          .find(this.$route.params.id)
      },
      isGameLoaded () {
        // console.log(Game)
        // return this
      }
    }
  }
</script>
