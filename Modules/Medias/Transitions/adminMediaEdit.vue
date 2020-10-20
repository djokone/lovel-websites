<template>
  <div>
    <h1 class="main-title">
      Edition des medias
    </h1>
    <el-button icon="el-icon-refresh" style="margin-bottom: 20px;" @click="loadData">Recharger les données</el-button>
      <el-row>
        <div>
          <el-card v-if="Media">
            <adminMediasEdit :media="Media"></adminMediasEdit>
          </el-card>
        </div>
      </el-row>
  </div>
</template>

<script>
  import adminMediasEdit from '@/Modules/Medias/Templates/adminMediasEdit'
  import { mapActions } from 'vuex'

  export default {
    name: 'adminMediaEdit',
    components: {
      adminMediasEdit
    },
    created () {
      this.loadData()
    },
    computed: {
      database () {
        return this.$store.getters.currentDatabaseId
      },
      Media () {
        let entity = this.database + '/medias/query'
        let query = this.$store.getters[entity]
        return query().find(this.$route.params.id)
      }
    },
    methods: {
      ...mapActions(['adminLoadMedia']),
      loadData () {
        this.adminLoadMedia({
          id: this.$route.params.id
        })
      }
    }
  }
</script>
