<template>
    <div>
      <h1 class="main-title">
        <span class="icomoon">&#xe9a9</span>
        Configuration des défis
      </h1>
      <el-tabs tab-position="left">
        <el-tab-pane label="Edition défis">
            <AdminChallengesIndex></AdminChallengesIndex>
        </el-tab-pane>
        <el-tab-pane label="Edition des jeux">
            <AdminGamesHome></AdminGamesHome>
        </el-tab-pane>
      </el-tabs>
      <router-view>
      </router-view>
    </div>
</template>

<script>
  import AdminChallengesIndex from '../Transitions/adminChallengesIndex'
  import AdminChallengesList from '../Templates/AdminChallengesList'
  import AdminGamesHome from '@/Modules/Games/Transitions/adminGamesHome'
  import ChallengeEdit from '../Templates/AdminChallengeEdit'
  import challenge from '../Services/Challenge'
  import Interest from '../../Interets/Services/Interest'

  // import { mapActions } from 'vuex'
  export default {
    name: 'adminChallengesIndex',
    components: {
      AdminChallengesList,
      ChallengeEdit,
      AdminChallengesIndex,
      AdminGamesHome
    },
    computed: {
      challenges () {
        return challenge.query().get()
      },
      interests () {
        return Interest.query().get()
      }
    },
    methods: {
      loadData () {
      }
    },
    created () {
      this.loadData()
    }
  }
</script>
<style>
  .admin-challenges-settings-view {
    margin: 20px 0px;
  }
</style>
