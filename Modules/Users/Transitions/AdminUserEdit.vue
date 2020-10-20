<template>
    <div>
      <h1 class="main-title">
        <span class="icomoon">&#xe972</span>
        Edition des utilisateurs
      </h1>
      <el-button icon="el-icon-refresh" style="margin-bottom: 20px;" @click="loadData">Recharger les données</el-button>
      <el-row>
        <div>
          <el-card v-if="User">
            <UserEdit :user="User" :auth="Auth" :tagManager="true"></UserEdit>
          </el-card>
          <el-row>
            <el-col :span="12">
              <el-card>
                <adminMatchesGestion :user="User"/>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <!-- <adminSettingsPreview :user="User"/> -->
              </el-card>
            </el-col>
          </el-row>
          <el-card>
            <adminMediasPreview :user="User"/>
          </el-card>
        </div>
      </el-row>
    </div>
</template>

<script>
  import UserEdit from '../Templates/adminUserEdit'
  import { mapActions } from 'vuex'
  import adminMatchesGestion from '@/Modules/Matches/Templates/adminMatchesGestion'
  import adminMediasPreview from '@/Modules/Medias/Templates/adminMediasPreview'
  // import adminSettingsPreview from '@/Modules/UserSettings/Templates/adminSettingsPreview'

  export default {
    name: 'admin-users-transition',
    components: {
      UserEdit,
      adminMatchesGestion,
      adminMediasPreview
      // adminSettingsPreview
    },
    data () {
      return {
        isLoading: false,
        UserLoad: true,
        UsersLoad: true
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
      User () {
        let entity = this.database + '/users/query'
        let query = this.$store.getters[entity]
        return query().find(this.$route.params.id)
      },
      Medias () {
        return this.$store.getters[this.database + '/medias/query']()
          .where('ref_id', this.User.id)
          .get()
      },
      Auth () {
        return this.$store.getters[this.database + '/auths/query']()
          .where('uid', this.User.id)
          .get()[0]
      }
    },
    methods: {
      ...mapActions(['adminLoadUser']),
      isRoot (interet) {
        return !this.parent_id
      },
      loadData () {
        this.adminLoadUser({
          id: this.$route.params.id
        })
      }
    }
  }
</script>
