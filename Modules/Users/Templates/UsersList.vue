<template>
  <div>
    <el-row v-if="addChallengeShortcut">
      <el-col>
        <el-card>
          <div slot="header" class= "clearfix">
            <span class="small-title admin-header">Ajouter un utilisateur</span>
            <i style="float: right;" class="el-icon-close admin-link" @click="toogleAddChallenge"></i>
          </div>
          <UserEdit :mode="'add'"/>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card>
        <div slot="header" class="clearfix">
          <span class="small-title admin-header">
            Liste des utilisateurs - database : {{database}}
          </span>
        </div>
        <div>
          <el-button type="success" @click="toogleAddChallenge" v-if="!addChallengeShortcut">+ Ajouter un utilisateur</el-button>
          <el-button type="warning" @click="toogleExport" icon="el-icon-upload" v-if="!ExportationBehavior.isExport">Traitement</el-button>
          <el-button icon="el-icon-refresh" style="margin-bottom: 20px; float: right" @click="loadData">Recharger les données</el-button>
          <el-progress :text-inside="true" :stroke-width="26" v-if="genderProportion.maleProportion" :percentage=genderProportion.maleProportion></el-progress>
          <el-progress :text-inside="true" :stroke-width="26" v-if="genderProportion.maleProportion" :percentage=genderProportion.femaleProportion status="exception"></el-progress>
        </div>
        <ExportTable
          v-if="ExportationBehavior.isExport"
          :Model="UserModel"
          :selectionMode="ExportationBehavior.selectionMode"
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
          @filter="changeFilters"/>
        <entities-list
          :model="Model"
          :selectionMode="isSelectionMode"
          :ignoredFields="['childrens', 'tags', 'auth','birthday', 'onboard', 'birthdate', 'social', 'researchGender',
          'researchDistance', 'researchAge', 'researchRelationKind', 'firstname', 'lastname', 'description', 'thumbs', 'userSettings']"
          :FieldsSlots="['required']"
          :textLabels=textLabels
          :data="results"
          :isLoading="isLoading"
          :iconOption="'el-icon-star-off'"
          :deleteAction="'adminDeleteUser'"
          :additionalColumns="['Email']"
          @changeSelection="onChangeSelection"
        >
          <template v-slot:Email="data">
              {{getEmail(data)}}
          </template>
          <!-- <template v-slot:expand="data"><p>lol</p></template> -->
          <template slot="required" slot-scope="item"></template>
        </entities-list>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import SearchBehavior from '@/Modules/Search/Mixins/SearchBehavior'
  import ExportTable from '@/Modules/DatabasesManager/Templates/ExportTable'
  import ExportationBehavior from '@/Modules/DatabasesManager/Mixins/ExportationBehavior'
  import Search from '@/Modules/Search/Templates/Search'
  import {User} from '../Services/User'
  import EntitiesList from '@/Modules/DatabasesManager/Templates/EntitiesList'
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'
  import UserEdit from '@/Modules/Users/Templates/adminUserEdit'

  export default {
    name: 'UserList',
    mixins: [SearchBehavior, LoadCurrentDatabase, ExportationBehavior],
    load: {
      actions: ['adminLoadAuths']
    },
    components: {
      ExportTable,
      Search,
      EntitiesList,
      UserEdit
    },
    searchBehavior: {
      model: User,
      ignoreParents: []
    },
    data () {
      return {
        isLoad: false,
        load: true,
        isLoading: false,
        addChallengeShortcut: false,
        textLabels: {
          action: 'Opération',
          users: 'utilisateur',
          firstname: 'Prénom',
          lastname: 'Nom',
          displayName: 'Nom d\'utilisateur',
          gender: 'Genre',
          city: 'Ville'
        },
        filters: [],
        search: {
          term: '',
          options: {}
        }
      }
    },
    computed: {
      results () {
        let usersQuery = this.$store.getters[this.database + '/users/query']()
        usersQuery = usersQuery.with('auth').get()
        return usersQuery
      },
      UserModel () {
        return User
      },
      debug () {
        return this.$store.getters.debug
      },
      database () {
        return this.$store.getters.currentDatabaseId
      },
      maleArray () {
        return this.results.filter(v => v.gender === 'male')
      },
      femaleArray () {
        return this.results.filter(v => v.gender === 'female')
      },
      genderProportion () {
        let percentage = {}
        let total = this.maleArray.length + this.femaleArray.length
        percentage.maleProportion = Math.floor(this.maleArray.length * 100 / total)
        percentage.femaleProportion = Math.floor(this.femaleArray.length * 100 / total)
        return percentage
      }
    },
    methods: {
      getEmail (row) {
        if (row.field.row.auth) {
          return row.field.row.auth.email
        }
        return ''
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
