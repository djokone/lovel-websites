<template>
  <div>
    <h1 class="main-title">
        <span class="icomoon">&#xe9a9</span>
      Editer challenge :
    </h1>
    <el-row>
      <el-button icon="el-icon-refresh" style="margin-bottom: 20px;" @click="loadData">Recharger les données</el-button>
    </el-row>
      <el-card v-if="challenge">
        <div slot="header" class="clearfix">
          <span>{{challenge.name}}</span>
        </div>
        <AdminChallengeEdit :challenge="challenge" :interestList="interetsList" :gamesList="gamesList" :typeList="typeList"/>
      </el-card>
  </div>
</template>

<script>
  // import Challenge from '../Services/Challenge'
  // import Game from '@/Modules/Games/Services/Game'
  import AdminChallengeEdit from '../Templates/AdminChallengeEdit'
  import { mapActions } from 'vuex'
  export default {
    name: 'adminChallengeEdit',
    data () {
      return {
        isLoaded: true
      }
    },
    components: {
      AdminChallengeEdit
    },
    created () {
      this.loadData()
    },
    methods: {
      ...mapActions(['adminFirestoreLoadInterests', 'adminLoadChallenge', 'adminLoadGames', 'adminLoadTypes']),
      loadData () {
        this.adminLoadChallenge({
          id: this.$route.params.id
        })
        this.adminFirestoreLoadInterests({
          verbose: this.debug
        })
        this.adminLoadGames({
          verbose: this.debug
        })
        this.adminLoadTypes({
          verbose: this.debug
        })
      }
    },
    computed: {
      debug () {
        return this.$store.getters.debug
      },
      database () {
        return this.$store.getters.currentDatabaseId
      },
      challenge () {
        let entity = this.database + '/challenges/query'
        let query = this.$store.getters[entity]
        return query().find(this.$route.params.id)
        // let challenge = query()
        // let currentChallenge = this.$store.getters[entity]().first(this.$route.params.id)
        // console.log(currentChallenge)
        // if (currentChallenge && currentChallenge.interests_ids) {
        //   challenge = challenge.with('interests')
        // }
        // if (currentChallenge && currentChallenge.game_id) {
        //   challenge = challenge.with('game')
        // }
        // console.log(challenge)
        // let data = challenge.first(this.$route.params.id)
        // console.log(data)
        // return data
      },
      isChallengeLoaded () {
        // console.log(Challenge)
        // return this
      },
      interests () {
        let entity = this.database + '/interests/query'
        let query = this.$store.getters[entity]
        return query()
          .with('childrens')
          .with('parent')
          .get()
      },
      games () {
        let entity = this.database + '/games/query'
        let query = this.$store.getters[entity]
        return query()
          .get()
      },
      types () {
        let entity = this.database + '/types/query'
        let query = this.$store.getters[entity]
        return query()
          .get()
      },
      interetsList () {
        return this.interests ? this.interests.map((v) => {
          return {id: v.id, name: v.name}
        }) : {}
      },
      gamesList () {
        return this.games ? this.games.map((v) => {
          return {id: v.id, name: v.name}
        }) : {}
      },
      typeList () {
        return this.types ? this.types.map((v) => {
          return {id: v.id, name: v.name}
        }) : {}
      }
    }
  }
</script>
