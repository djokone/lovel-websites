<template>
    <div>
      <h1 class="main-title">
        <span class="icomoon"></span>
        Edition des Matches
      </h1>
      <el-button icon="el-icon-refresh" style="margin-bottom: 20px;" @click="loadData">Recharger les données</el-button>
      <el-row>
        <div>
          <el-card v-if="Match">
            <MatchEdit :match="Match" :tagManager="true" v-loading="isLoading"></MatchEdit>
          </el-card>
        </div>
      </el-row>
    </div>
</template>

<script>
  import MatchEdit from '../Templates/adminMatchEdit'
  import { mapActions } from 'vuex'
  export default {
    name: 'admin-matchs-transition',
    components: {
      MatchEdit
    },
    data () {
      return {
        isLoading: false,
        MatchLoad: true,
        MatchsLoad: true
      }
    },
    created () {
      this.loadData()
    },
    computed: {
      debug () {
        return this.$store.getters.debug
      },
      database () {
        return this.$store.getters.currentDatabaseId
      },
      Match () {
        let entity = this.database + '/matchs/query'
        let query = this.$store.getters[entity]
        return query().find(this.$route.params.id)
      }
    },
    methods: {
      ...mapActions(['adminLoadMatch']),
      isRoot (interet) {
        return !this.parent_id
      },
      loadData () {
        this.adminLoadMatch({
          id: this.$route.params.id
        })
      }
    }
  }
</script>