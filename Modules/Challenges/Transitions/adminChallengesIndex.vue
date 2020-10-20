<template>
    <div>
      <h1 class="main-title" v-if="viewMode === 'Simple'">
        <span class="icomoon">&#xe9a9</span>
        Configuration des défis
      </h1>
      <!-- Handle the entity -->
      <el-row>
        <el-radio-group v-model="viewMode">
          <el-radio-button label="Simple"></el-radio-button>
          <el-radio-button label="Advanced"></el-radio-button>
        </el-radio-group>
        <el-button icon="el-icon-refresh" style="margin-bottom: 20px;" @click="loadData">
          Recharger les données
        </el-button>
      </el-row>
      <!-- Add challenge shortcut-->
      <el-row v-if="addChallengeShortcut" >
        <el-card>
          <div slot="header" class="clearfix">
            <span class="small-title admin-header">Ajouter un défis</span>
            <i style="float: right;" class="el-icon-close admin-link" @click="toogleAddChallenge"></i>
          </div>
          <ChallengeEdit
            :interestList="interests"
            label-position="top"
            mode="add"
            :gamesList="games"
            @save="afterSave"
          />
        </el-card>
      </el-row>
      <!-- Challenge list -->
      <el-row>
        <el-card>
          <div slot="header" class="clearfix">
            <span class="small-title admin-header">
              Liste de défis - database : {{database}}
            </span>
          </div>
          <el-row>
            <!-- Shortcut actions list -->
            <el-button type="success" @click="toogleAddChallenge" v-if="!addChallengeShortcut">
              + Ajouter un défi
            </el-button>
            <el-button icon="el-icon-upload" type="warning" @click="toogleExport" v-if="!ExportationBehavior.isExport">
              Exportation
            </el-button>
          </el-row>
          <ExportTable
            v-if="ExportationBehavior.isExport"
            :Model="ChallengeModel"
            :selectionMode="ExportationBehavior.selectionMode"
            :export="results"
            :selection="ExportationBehavior.selection"
            @changeSelectionMode="onChangeSelectionMode"
            @cancel="toogleExport"
          />
          <Search
            v-if="!isAllMode"
            :Model="ChallengeModel"
            :results="results"
            :labels="textLabels"
            @search="changeSearch"
            @filter="changeFilters"/>
          <el-row>
            <entities-list
              :model="Model"
              max-height="625"
              :selectionMode="isSelectionMode"
              :ignoredFields="['required', 'tags', 'interests', 'description']"
              :FieldsSlots="['required']"
              :textLabels="textLabels"
              :data="results"
              :isLoading="isLoading"
              deleteAction='adminRemoveChallenge'
              @changeSelection="onChangeSelection"
            >
              <template slot="expand" slot-scope="props">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <p style="text-align: left;">
                      Règle du défi : <br>
                      {{props.table.row.description}}
                    </p>
                  </el-col>
                  <el-col :span="12" v-if="props.table.row.interests.length > 0">
                    <p  style="text-align: left;">
                      Centres d'intérets : <br>
                    </p>
                    <p style="text-align: left;">
                      <el-tag v-for="(interest, index) in props.table.row.interests" :key="index">
                        {{interest.name}}
                      </el-tag>

                    </p>
                  </el-col>
                </el-row>
              </template>
              <template slot="required" slot-scope="item">
                <!--{{item.field.row}}-->
              </template>
            </entities-list>
            <!--<AdminChallengesList-->
              <!--:selectionMode="isSelectionMode"-->
              <!--:challenges="results"-->
              <!--:interests="interests"-->
              <!--:is-loading="isLoading"-->
              <!--@changeSelection="onChangeSelection"-->
            <!--&gt;-->
            <!--</AdminChallengesList>-->
          </el-row>
        </el-card>
      </el-row>
    </div>
</template>

<script>
  import AdminChallengesList from '../Templates/AdminChallengesList'
  import ChallengeEdit from '../Templates/AdminChallengeEdit'
  import Search from '@/Modules/Search/Templates/Search'
  import SearchBehavior from '@/Modules/Search/Mixins/SearchBehavior'
  import ExportationBehavior from '@/Modules/DatabasesManager/Mixins/ExportationBehavior'
  import ExportTable from '@/Modules/DatabasesManager/Templates/ExportTable'
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'
  import EntitiesList from '@/Modules/DatabasesManager/Templates/EntitiesList'
  import Challenge from '../Services/Challenge'

  /**
   * Display challenges list for the administration
   * ``` js
   * ... // in Router
   * {
   *  name: 'adminChallengesIndex',
   *  path: 'challenges-list',
   *  component: require('/Modules/Challenges/Transitions/adminChallengesIndex')
   * },
   * ...
   * ```
   * @mixins [SearchBehavior, LoadCurrentDatabase, ExportationBehavior]
   */
  export default {
    name: 'adminChallengesIndex',
    components: {
      EntitiesList,
      AdminChallengesList,
      ChallengeEdit,
      Search,
      ExportTable
    },
    mixins: [SearchBehavior, LoadCurrentDatabase, ExportationBehavior],
    load: {
      actions: ['adminLoadChallenges', 'adminFirestoreLoadInterests', 'adminLoadGames'],
      getters: ['interests', 'games']
    },
    searchBehavior: {
      model: Challenge,
      ignoreParents: []
    },
    data () {
      return {
        isLoad: false,
        load: true,
        isLoading: false,
        addChallengeShortcut: false,
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
      ChallengeModel () {
        return Challenge
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
      interests () {
        return this.getters.interests
      },
      games () {
        return this.getters.games
      },
      viewMode: {
        get () {
          return this.$route.name === 'adminChallengesIndex' ? 'Simple' : 'Advanced'
        },
        set (v) {
          if (v === 'Advanced') {
            this.$router.push({name: 'adminChallengesTab'})
          } else {
            this.$router.push({name: 'adminChallengesIndex'})
          }
        }
      }
    },
    methods: {
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
