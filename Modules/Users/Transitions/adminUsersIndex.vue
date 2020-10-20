<template>
    <div>
        <h1 class="main-title">Gestions des utilisateurs</h1>
<!--        <CreateUser/>-->
      <el-tabs tab-position="left" style="" v-model="currentTab">
        <el-tab-pane label="Pré-inscris" name="admin-app">
          <el-card>
            <subscriptionList :paginator="subscriptionList.pagination"/>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="Application" name="admin-users-panel">
          <el-card>
            <admin-users-panel/>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="Administrateur" name="admin-list">
          <el-card>
            <!--<subscriptionList :paginator="subscriptionList.pagination"/>-->
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="Utilisateur" name="users-list">
          <el-card>
            <UserList/>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="Matches" name="matches-list">
          <el-card>
            <MatchesList/>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="Medias" name="admin-medias-list">
          <el-card>
            <adminMediasList/>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import { mapActions } from 'vuex'
  // import loadContent from '/Mixins/loadContentMixin'

  /**
   * Import templates
   */
  import subscriptionList from '@/Modules/Subscription/Templates/adminSubscriptionsList'
  // import CreateUser from '../Templates/AdminCreateUser'
  import adminUsersPanel from '@/Modules/Users/Templates/adminUsersPanel'
  import UserList from '../Templates/UsersList'
  import MatchesList from '@/Modules/Matches/Templates/MatchesList'
  import adminMediasList from '@/Modules/Medias/Templates/adminMediasList'

  const SubscriptionPaginator = {
    limit: 60
  }

  export default {
    name: 'adminUsersIndex',
    // mixins: [loadContent],
    components: {
      subscriptionList,
      // CreateUser,
      adminUsersPanel,
      UserList,
      MatchesList,
      adminMediasList
    },
    data () {
      return {
        subscriptionList: {
          paginator: SubscriptionPaginator,
          pagination: {}
        }
      }
    },
    mounted () {
      this.InsertSubscriptions(this.subscriptionList.paginator).then((res) => {
      })
    },
    computed: {
      // formatedSubscriptionListPagination () {
      //   return {
      //     this.
      //   }
      // }
      currentTab: {
        get () {
          return this.$route.params.tab ? this.$route.params.tab : 'users-list'
        },
        set (val) {
          console.log(val)
          this.$router.push({name: 'adminUsersIndex', params: {tab: val}})
        }
      }
    },
    methods: {
      ...mapActions(['InsertSubscriptions', 'getLists']),
      getPaginate (dataSet) {
        let query = this.$route.query[dataSet] ? this.$route.query[dataSet] : this.$route.query
        return {...this[dataSet].paginator, ...query}
      }
    }
  }
</script>
