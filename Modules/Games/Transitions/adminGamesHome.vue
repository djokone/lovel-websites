<template>
    <div>
      <h1 class="main-title" v-if="viewMode === 'Simple'">
        <span class="icomoon">&#xe9a9</span>
        Configuration des défis
      </h1>
      <el-row>
        <el-radio-group v-model="viewMode">
          <el-radio-button label="Simple"></el-radio-button>
          <el-radio-button label="Advanced"></el-radio-button>
        </el-radio-group>
      </el-row>
        <el-row v-if="addGameShortcut">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="small-title admin-header">
                Ajouter un nouveau jeu à lovel
              </span>
              <i style="float: right;" class="el-icon-close admin-link" @click="toogleAddGame"></i>
            </div>
            <GameEdit :interestList="interests" label-position="top" mode="add"></GameEdit>
          </el-card>
        </el-row>
        <el-row>
        <el-card>
          <div slot="header" class="clearfix">
            <span class="small-title admin-header">
              Liste de jeux
            </span>
          </div>
          <el-row>
            <el-button type="success" @click="toogleAddGame" v-if="!addGameShortcut">+ Ajouter un type de jeux</el-button>
            <el-button type="warning" @click="toogleExport" icon="el-icon-upload" v-if="!ExportationBehavior.isExport">Traitement</el-button>
            <el-button icon="el-icon-refresh" style="margin-bottom: 20px; float: right" @click="loadData">Recharger les données</el-button>
          </el-row>
          <ExportTable
            v-if="ExportationBehavior.isExport"
            :Model="Model"
            :selectionMode="ExportationBehavior.selectionMode"
            :export="results"
            :selection="ExportationBehavior.selection"
            @changeSelectionMode="onChangeSelectionMode"
            @cancel="toogleExport"
          />
          <Search
            v-if="!isAllMode"
            :Model="Model"
            :results="results"
            :labels="searchLabels"
            @search="changeSearch"
            @filter="changeFilters"
          />
          <AdminGamesList
            :Games="results"
            :labels="searchLabels"
            :interests="interests"
          >
          </AdminGamesList>
        </el-card>
      </el-row>
    </div>
</template>

<script>
  /**
   * Imports Components
   */
  import AdminGamesList from '../Templates/AdminGamesList'
  import GameEdit from '../Templates/AdminGameEdit'
  import Search from '@/Modules/Search/Templates/Search'
  import ExportTable from '@/Modules/DatabasesManager/Templates/ExportTable'

  /**
   * Imports Behaviors
   */
  import SearchBehavior from '@/Modules/Search/Mixins/SearchBehavior'
  import ExportationBehavior from '@/Modules/DatabasesManager/Mixins/ExportationBehavior'

  /**
   * Imports Models tools
   */
  import { mapActions } from 'vuex'
  import Game from '../Services/Game'

  export default {
    name: 'adminGamesIndex',
    components: {
      AdminGamesList,
      GameEdit,
      Search,
      ExportTable
    },
    mixins: [SearchBehavior, ExportationBehavior],
    searchBehavior: {
      model: Game
    },
    data () {
      return {
        addGameShortcut: false,
        searchLabels: {
          games: 'jeux'
        }
      }
    },
    computed: {
      Model () {
        return Game
      },
      debug () {
        return this.$store.getters.debug
      },
      databaseId () {
        return this.$store.getters['currentDatabaseId']
      },
      Games () {
        return this.$store.getters[this.databaseId + '/games/query']().get()
      },
      interests () {
        return this.$store.getters[this.databaseId + '/interests/query']().get()
      },
      viewMode: {
        get () {
          return this.$route.name === 'adminGamesIndex' ? 'Simple' : 'Advanced'
        },
        set (v) {
          if (v === 'Advanced') {
            this.$router.push({name: 'adminGamesTab'})
          } else {
            this.$router.push({name: 'adminGamesIndex'})
          }
        }
      }
    },
    methods: {
      ...mapActions(['adminLoadGames', 'adminFirestoreLoadInterests']),
      loadData () {
        this.adminLoadGames({
          verbose: this.debug
        })
        this.adminFirestoreLoadInterests({
          verbose: this.debug
        })
      },
      toogleAddGame () {
        this.addGameShortcut = !this.addGameShortcut
      }
    },
    created () {
      this.loadData()
    }
  }
</script>
<style lang="scss">
  .admin-header {
    font-weight: bold;
    margin: 0px;
  }
  .admin-link {
    cursor: pointer;
  }
</style>
