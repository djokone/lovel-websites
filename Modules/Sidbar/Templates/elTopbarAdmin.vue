<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item
      index="2"
      style="float:right"
      v-if="selectedDatabase"
    >
      <label for="databaseSelect">Base de donnée : </label>
      <el-select
        v-model="selectedDatabase"
        placeholder="Select"
        size="mini"
        id="databaseSelect"
      >
        <el-option
          v-for="item in firebaseDatabase"
          :key="item.projectId"
          :label="item.name ? item.name : item.projectId.charAt(0).toUpperCase() + item.projectId.slice(1)"
          :value="item.projectId"
        >
        </el-option>
      </el-select>
    </el-menu-item>
    <el-menu-item
      index="2"
      style="float:right"
    >
      <label style="margin-right: 6px;">Debug mode </label>
      <el-switch v-model="debugMode"></el-switch>
    </el-menu-item>
  </el-menu>
</template>

<script>
  // import { database } from '@/Modules/DatabaseManager'
  import databases from '@/Modules/DatabasesManager/DatabaseManager'
  import { mapActions } from 'vuex'
  // import {clone} from 'lodash'
  export default {
    name: 'el-topbar-admin',
    data () {
      return {
        selectedDatabase: databases.currentDatabaseId,
        debugMode: process.env.NODE_ENV !== 'production'
      }
    },
    computed: {
      currentDatabase () {
        return databases.databaseConfig
      },
      firebaseDatabase () {
        return [
          ...databases.databasesConfigs,
          { projectId: 'entities', name: 'Local' }
        ]
      }
    },
    methods: {
      ...mapActions(['adminChangeCurrentDatabase', 'adminToogleDebug']),
      handleSelect () {
        console.log('handle Select')
      }
    },
    created () {
      // atabases.currentDatabaseId.pot
    },
    watch: {
      debugMode (val) {
        console.log('change debug mode to ' + val)
        this.adminToogleDebug()
      },
      currentDatabase (old, newVal) {
        console.log('isChanged')
        console.log(newVal)
        // this.$currentDatabase = clone(this.currentDatabase.apiKey)
      },
      selectedDatabase (val) {
        console.log('change databse to ' + val)
        this.adminChangeCurrentDatabase(val)
        // this.$currentDatabase = clone(this.currentDatabase.apiKey)
      }
    }
  }
</script>

<style scoped>
</style>
