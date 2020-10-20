<template>
  <div>
    <h3>Parametres utilisateur</h3>
    <el-form>
      <el-col :span="12">
        <h1>Sons de notifications</h1>
        <el-form-item label="Nouveau message">
          <el-switch v-model="userSettings.messages" disabled></el-switch>
        </el-form-item>
        <el-form-item label="Nouveau match">
          <el-switch v-model="userSettings.matches" disabled></el-switch>
        </el-form-item>
        <el-form-item label="Nouveau like">
          <el-switch v-model="userSettings.likes" disabled></el-switch>
        </el-form-item>
        <el-form-item label="Nouvelle visite">
          <el-switch v-model="userSettings.visits" disabled></el-switch>
        </el-form-item>
        <el-form-item label="Nouveau défi">
          <el-switch v-model="userSettings.challenges" disabled></el-switch>
        </el-form-item>
        <el-form-item label="Promotions">
          <el-switch v-model="userSettings.offers" disabled></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <h1>Préférences</h1>
        <el-form-item label="Géolocalisation">
          <el-switch v-model="userSettings.localization" disabled></el-switch>
        </el-form-item>
        <el-form-item label="Appareil photo">
          <el-switch v-model="userSettings.camera" disabled></el-switch>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'

  export default {
    name: 'adminSettingsPreview',
    mixins: [LoadCurrentDatabase],
    props: {
      user: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    load: {
      actions: []
    },
    created () {
      this.loadSettings()
    },
    computed: {
      userSettings () {
        return this.$store.getters[this.database + '/userSettings/query']().get()[0]
      }
    },
    methods: {
      ...mapActions(['adminLoadUserSettings']),
      loadSettings () {
        this.adminLoadUserSettings({
          id: this.user.id
        })
      }
    }
  }
</script>
