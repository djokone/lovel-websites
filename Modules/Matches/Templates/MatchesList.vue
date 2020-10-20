<template>
  <div>
    <el-row v-if="addChallengeShortcut">
      <el-col>
        <el-card>
          <div>
            <span class="small-title admin-header">Créer un nouveau match</span>
            <i style="float: right;" class="el-icon-close admin-link" @click="toogleAddChallenge"></i>
          </div>
          <MatchesEdit mode="add"/>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card>
        <div slot="header" class="clearfix">
          <span class="small-title admin-header">
            Liste des matches - database : {{database}}
          </span>
        </div>
        <div>
          <el-button type="success" @click="toogleAddChallenge" v-if="!addChallengeShortcut">+ Ajouter un match</el-button>
          <el-button type="warning" @click="toogleExport" icon="el-icon-upload" v-if="!ExportationBehavior.isExport">Traitement</el-button>
          <el-button icon="el-icon-refresh" style="margin-bottom: 20px; float: right" @click="loadData">Recharger les données</el-button>
        </div>
        <ExportTable
        v-if="ExportationBehavior.isExport"
        :Model="MatchModel"
        :selectionMode="ExportationBehavior.SelectionMode"
        :export="results"
        :selection="ExportationBehavior.selection"
        @changeSelectionMode="onChangeSelectionMode"
        @cancel="toogleExport"
        />
        <Search
          :Model="Model"
          :results="results"
          :labels="textLabels"
          @search="changeSearch"
          @filter="changeFilters"
        />
        <entities-list
          :model="Model"
          :selectionMode="isSelectionMode"
          :ignoredFields="['childrens', 'last_visite', 'messages', 'from_last_visite', 'to_last_visite', 'user_ids']"
          :textLabels="textLabels"
          :data="results"
          :isLoading="isLoading"
          @changeSelection="onChangeSelection"
        >
          <template v-slot:created="data">
            {{getDate(data.field.row, 'created')}}
          </template>
          <template v-slot:updated="data">
            {{getDate(data.field.row, 'updated')}}
          </template>
          <template v-slot:from_user="data">
            {{getUsers(data.field.row, 'from_user')}}
          </template>
          <template v-slot:to_user="data">
            {{getUsers(data.field.row, 'to_user')}}
          </template>
        </entities-list>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import ExportationBehavior from '@/Modules/DatabasesManager/Mixins/ExportationBehavior'
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'
  import Match from '../Services/Match'
  import SearchBehavior from '@/Modules/Search/Mixins/SearchBehavior'
  import Search from '@/Modules/Search/Templates/Search'
  import ExportTable from '@/Modules/DatabasesManager/Templates/ExportTable'
  import EntitiesList from '@/Modules/DatabasesManager/Templates/EntitiesList'
  import MatchesEdit from '../Templates/adminMatchEdit'

  export default {
    name: 'MatchesList',
    mixins: [SearchBehavior, ExportationBehavior, LoadCurrentDatabase],
    load: {
      actions: ['adminLoadMatches']
    },
    components: {
      MatchesEdit,
      Search,
      ExportTable,
      EntitiesList
    },
    searchBehavior: {
      model: Match,
      ignoreParents: []
    },
    data () {
      return {
        isLoad: false,
        load: true,
        isLoading: false,
        addChallengeShortcut: false,
        textLabels: {
          action: 'Opération'
        },
        filters: [],
        search: {
          term: '',
          options: {}
        }
      }
    },
    computed: {
      MatchModel () {
        return Match
      },
      debug () {
        return this.$store.getters.debug
      },
      database () {
        return this.$store.getters.currentDatabaseId
      },
      matchs () {
        return this.$store.getters[this.database + '/matchs/query']()
        .with('from_user')
        .with('to_user')
        .get()
      }
    },
    methods: {
      getDate (row, field) {
        if (row[field] && row[field] !== null) {
          let date = String(new Date(row[field].seconds * 1000))
          return date.slice(0, 25)
        }
      },
      getUsers (row, field) {
        if (row[field] && row[field] !== null) {
          return row[field].displayName
        }
      },
      afterSave () {
        this.toogleAddChallenge()
      },
      toogleAddChallenge () {
        this.addChallengeShortcut = !this.addChallengeShortcut
      }
    },
    created () {
      this.loadData()
    }
  }
</script>
