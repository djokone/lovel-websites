<template>
    <div>
      <h1 class="main-title">Réglages des paramètres généraux</h1>
      <el-card>

      </el-card>
        <settingsList>
        </settingsList>
    </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import loadContent from '@/Mixins/loadContentMixin'

  import settingsList from '../Templates/adminSettingsList'

  export default {
    name: 'admin-settings-index',
    components: {
      settingsList
    },
    mixins: [loadContent],
    data () {
      return {}
    },
    methods: {
      ...mapActions(['getSettings']),
      async loadContent () {
        return await this.load('getSettings')
      }
    }
  }
</script>

<style scoped>

</style>
