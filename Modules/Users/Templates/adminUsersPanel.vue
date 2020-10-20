<template>
    <div>
      <!-- Add challenge shortcut-->
      <el-row v-if="addUserShortcut" >
        <el-card>
          <div slot="header" class="clearfix">
            <span class="small-title admin-header">Ajouter un défis</span>
            <i style="float: right;" class="el-icon-close admin-link" @click="toogleAddUser"></i>
          </div>
          <!--<UserEdit-->
            <!--:interestList="interests"-->
            <!--label-position="top"-->
            <!--mode="add"-->
            <!--:gamesList="games"-->
            <!--@save="afterSave"-->
          <!--/>-->
        </el-card>
        <el-button icon="el-icon-refresh" style="margin-bottom: 20px; float: right" @click="loadData">
          Recharger les données
        </el-button>
      </el-row>
      <!-- User list -->
      <el-row>
        <el-card>
          <div slot="header" class="clearfix">
            <span class="small-title admin-header">
              Liste des comptes utilisateur - database : {{database}}
            </span>
          </div>
          <el-row>
            <!-- Shortcut actions list -->
            <el-button type="success" @click="toogleAddUser" v-if="!addUserShortcut">
              + Ajouter un compte utilisateur
            </el-button>
            <el-button icon="el-icon-upload" type="warning" @click="toogleExport" v-if="!ExportationBehavior.isExport">
              Exportation
            </el-button>
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
            :labels="textLabels"
            @search="changeSearch"
            @filter="changeFilters"/>
          <el-row>
            <entities-list
              :model="Model"
              max-height="625"
              :selectionMode="isSelectionMode"
              :ignoredFields="['required']"
              :FieldsSlots="['required']"
              :textLabels="textLabels"
              :data="results"
              :isLoading="isLoading"
              @changeSelection="onChangeSelection"
            >
            </entities-list>
          </el-row>
        </el-card>
      </el-row>
    </div>
</template>

<script>
  /**
   * Behaviors imports
   */
  import SearchBehavior from '@/Modules/Search/Mixins/SearchBehavior'
  import ExportationBehavior from '@/Modules/DatabasesManager/Mixins/ExportationBehavior'
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'

  /**
   * Templates imports
   */
  import EntitiesList from '@/Modules/DatabasesManager/Templates/EntitiesList'
  import ExportTable from '@/Modules/DatabasesManager/Templates/ExportTable'
  // import AdminUsersList from '../Templates/AdminUsersList'
  // import UserEdit from '../Templates/AdminUserEdit'
  import Search from '@/Modules/Search/Templates/Search'

  /**
   * Model imports
   */
  import {User} from '../Services/User'
  // import {database} from '@/Modules/DatabaseManager'
  // import Interest from '../../Interets/Services/Interest'
  // import Game from '../../Games/Services/Game'
  // import { mapActions } from 'vuex'

  export default {
    name: 'AdminUsersPanel',
    components: {
      EntitiesList,
      // AdminUsersList,
      // UserEdit,
      Search,
      ExportTable
    },
    mixins: [SearchBehavior, LoadCurrentDatabase, ExportationBehavior],
    load: {
      actions: ['adminLoadUsers']
      // getters: ['interests', 'games']
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
        addUserShortcut: false,
        textLabels: {
          'challenges': 'défis',
          name: 'Nom',
          action: 'Opérations',
          'Game': 'Type de jeu',
          interest: 'centres d\'intérêt'
        },
        filters: [],
        search: {
          term: '',
          options: {}
        }
      }
    },
    computed: {
      UserModel () {
        return User
      },
      console () {
        return console
      },
      debug () {
        return this.$store.getters.debug
      },
      database () {
        return this.$store.getters.currentDatabaseId
      },
      challengesWithInterests () {
        // let that = this
        // return this.challenges.map((c) => {
        //   console.log(c)
        //   let findRef = that.challengesWithInterests.find(ci => ci.id === c.id)
        //   console.log(findRef)
        //   // if (findRef) {
        //   //   return {...c, ...findRef}
        //   // }
        // })
      },
      // interests () {
      //   return this.getters.interests
      // },
      // games () {
      //   return this.getters.games
      // },
      viewMode: {
        get () {
          return this.$route.name === 'adminUsersIndex' ? 'Simple' : 'Advanced'
        },
        set (v) {
          if (v === 'Advanced') {
            this.$router.push({name: 'adminUsersTab'})
          } else {
            this.$router.push({name: 'adminUsersIndex'})
          }
        }
      }
    },
    methods: {
      afterSave () {
        this.toogleAddUser()
      },
      toogleAddUser () {
        this.addUserShortcut = !this.addUserShortcut
      }
    }
  }
</script>
