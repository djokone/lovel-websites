<template>
    <div style="padding: 0px 20px">
      <h1 class="main-title"><span class="icomoon">&#xe9ba</span> Centres d'intéret</h1>
      <el-row v-if="addChallengeShortcut">
        <el-col>
          <el-card>
            <div slot="header" class="clearfix">
              <span class="small-title admin-header">
                Liste de défis - database : {{database}}
              </span>
              <i style="float: right;" class="el-icon-close admin-link" @click="toogleAddChallenge"></i>
            </div>
            <EditInterets :interestsList="interests" mode="add"/>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="small-title admin-header">
                Liste des centres d'intérêts - database : {{database}}
              </span>
            </div>
            <el-row>
              <el-button type="success" @click="toogleAddChallenge" v-if="!addChallengeShortcut">+ Ajouter un centre d'intéret</el-button>
              <el-button type="warning" @click="toogleExport" icon="el-icon-upload" v-if="!ExportationBehavior.isExport">Traitement</el-button>
              <el-button icon="el-icon-refresh" style="margin-bottom: 20px; float: right" @click="loadData">Recharger les données</el-button>
            </el-row>
            <ExportTable
              v-if="ExportationBehavior.isExport"
              :Model="Model"
              :ignoreFields="['$id', 'id', 'tags', 'childrens', 'parent']"
              :selectionMode="ExportationBehavior.selectionMode"
              :export="results"
              :selection="ExportationBehavior.selection"
              @changeSelectionMode="onChangeSelectionMode"
              @cancel="toogleExport"
            />
            <Search
              :Model="Model"
              :results="results"
              :labels="searchLabels"
              @search="changeSearch"
              @filter="changeFilters"/>
            <entities-list
              :model="Model"
              :selectionMode="isSelectionMode"
              :ignoredFields="['childrens', 'tags']"
              :FieldsSlots="['required']"
              :textLabels="{
                name: 'Nom',
                action: 'Opérations',
                interests: 'centres d\'intérêt'
              }"
              :data="results"
              :isLoading="isLoading"
              @changeSelection="onChangeSelection"
            >
              <template slot="expand"></template>
              <template slot="required" slot-scope="item">
                <!--{{item.field.row}}-->
              </template>
            </entities-list>
            <!--<InteretsList-->
              <!--:interests="results"-->
              <!--:isLoading="isLoading">-->
            <!--</InteretsList>-->
          </el-card>
        </el-col>
      </el-row>
    </div>

</template>

<script>
  import { mapActions } from 'vuex'

  /**
   * Import templates
   */
  import InteretsList from '../Templates/adminInteretsList'
  import EditInterets from '../Templates/adminInterestEdit'
  import Search from '@/Modules/Search/Templates/Search'
  import ExportTable from '@/Modules/DatabasesManager/Templates/ExportTable'
  import EntitiesList from '@/Modules/DatabasesManager/Templates/EntitiesList'

  import Interest from '../Services/Interest'
  // import Challenge from '@/Modules/Challenges/Services/Challenge'

  // import loadContent from '/Mixins/loadContentMixin'
  // import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'
  import SearchBehavior from '@/Modules/Search/Mixins/SearchBehavior'
  import ExportationBehavior from '@/Modules/DatabasesManager/Mixins/ExportationBehavior'

  export default {
    name: 'adminInteretsIndex',
    mixins: [SearchBehavior, ExportationBehavior],
    searchBehavior: {
      model: Interest,
      ignoreParents: ['tags']
    },
    components: {
      EditInterets,
      InteretsList,
      EntitiesList,
      Search,
      ExportTable
    },
    data () {
      return {
        isLoading: false,
        addChallengeShortcut: false,
        searchLabels: {
          'challenges': 'défis'
        }
      }
    },
    computed: {
      Model () {
        return Interest
      },
      debug () {
        return this.$store.getters.debug
      },
      database () {
        return this.$store.getters.currentDatabaseId
      },
      interests () {
        let entity = this.database + '/interests/query'
        let query = this.$store.getters[entity]
        return query()
          .with('childrens')
          .with('parent').get()
      }
    },
    methods: {
      ...mapActions(['adminFirestoreLoadInterests']),
      async loadData () {
        this.isLoading = true
        await this.adminFirestoreLoadInterests({
          verbose: this.debug
        })
        this.isLoading = false
      },
      toogleAddChallenge () {
        this.addChallengeShortcut = !this.addChallengeShortcut
      }
    },
    created () {
      this.loadData()
      console.log(this.$options.mixins)
    }
  }
</script>
