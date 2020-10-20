<template>
    <div>
      <h1 class="main-title">
        <span class="icomoon">&#xe9ba</span>
        Edition des centres d'intérets
      </h1>
      <el-button icon="el-icon-refresh" style="margin-bottom: 20px;" @click="loadData">Recharger les données</el-button>
      
      <el-row>
        <el-card v-if="Interest && Interest.parent">
          <h2 class="title" v-if="isParentRoot">Centre d'intéret racine</h2>
          <h2 class="title" v-if="!isParentRoot">Centre d'intéret parent</h2>
          <!--<span>ID : {{Interest.id}}</span>-->
          <InterestEdit :interest="Interest.parent" :interestsList="Interests" :tagManager="true" v-loading="isLoading">
          </InterestEdit>
        </el-card>
      </el-row>
      <el-row>
        <el-card v-if="Interest">
          <InterestEdit :interest="Interest" :interestsList="Interests" :tagManager="true" v-loading="isLoading">
          </InterestEdit>
        </el-card>
      </el-row>
    </div>
</template>

<script>
  import InterestEdit from '../Templates/adminInterestEdit'
  import { mapActions } from 'vuex'
  export default {
    name: 'admin-interest-transition',
    components: {
      InterestEdit
    },
    data () {
      return {
        isLoading: false,
        InterestLoad: true,
        InterestsLoad: true
      }
    },
    created () {
      this.loadData()
    },
    computed: {
      debug () {
        return this.$store.getters.debug
      },
      isParentRoot () {
        return this.isRoot(this.Interest)
      },
      database () {
        return this.$store.getters.currentDatabaseId
      },
      Interest () {
        let entity = this.database + '/interests/query'
        let query = this.$store.getters[entity]
        return query()
          .with('tags')
          .with('parent.childrens')
          .with('parent.tags')
          .with('childrens')
          // .has('interests')
          .find(this.$route.params.id)
      },
      Interests () {
        let entity = this.database + '/interests/query'
        let query = this.$store.getters[entity]
        return query()
          // .with('childrens')
          .with('parent')
          .get()
      }
      // Games () {
      //   return this.$store.getters[this.databaseId + '/games/query']().get()
      // }
    },
    methods: {
      ...mapActions(['adminFirestoreLoadInterests', 'adminFirestoreLoadInterest']),
      isRoot (interet) {
        return !this.parent_id
      },
      async loadData () {
        this.isLoading = true
        try {
          await this.adminFirestoreLoadInterest({
            id: this.$route.params.id,
            verbose: this.debug,
            loadParent: true,
            loadTags: true
          })
          await this.adminFirestoreLoadInterests({
            verbose: this.debug
          })
        } catch (e) {
          this.isLoading = false
          throw e
        }
        this.isLoading = false
        // this.getFirestoreAdminInterests({})
      }
    }
  }
</script>
