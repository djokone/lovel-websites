<template>
  <div>
    <el-row>
      <el-card>
        <div slot="header" class="clearfix">
          <span class="small-title admin-header">
            Liste des médias - database : {{database}}
          </span>
        </div>
        <div>
          <el-button type="warning" @click="toogleExport" icon="el-icon-upload" v-if="!ExportationBehavior.isExport">Traitement</el-button>
          <el-button icon="el-icon-refresh" style="margin-bottom: 20px; float: right" @click="loadData">Recharger les données</el-button>
        </div>
        <ExportTable
          v-if="ExportationBehavior.isExport"
          :Model="Media"
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
          @filter="changeFilters"
        />
        <entities-list
          :model="Model"
          :selectionMode="isSelectionMode"
          :ignoredFields="['id', 'created', 'index', 'base64', 'ref_id']"
          :FieldsSlots="['required']"
          :textLabels=textLabels
          :data="results"
          :isLoading="isLoading"
          @changeSelection="onChangeSelection"
        />
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import ExportationBehavior from '@/Modules/DatabasesManager/Mixins/ExportationBehavior'
  import ExportTable from '@/Modules/DatabasesManager/Templates/ExportTable'
  import Media from '@/Modules/Medias/Services/Media'
  import SearchBehavior from '@/Modules/Search/Mixins/SearchBehavior'
  import Search from '@/Modules/Search/Templates/Search'
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'
  import EntitiesList from '@/Modules/DatabasesManager/Templates/EntitiesList'

  export default {
    name: 'adminMediasList',
    mixins: [ExportationBehavior, SearchBehavior, LoadCurrentDatabase],
    load: {
      actions: ['adminLoadMedias', 'adminLoadUsers'],
      getters: ['medias', 'users']
    },
    components: {
      ExportTable,
      Search,
      EntitiesList
    },
    searchBehavior: {
      model: Media,
      ignoreParents: []
    },
    data () {
      return {
        isLoading: false,
        textLabels: {
          action: 'Opération',
          created_user_id: 'Utilisateur'
        }
      }
    },
    computed: {
      database () {
        return this.$store.getters.currentDatabaseId
      }
    }
  }
</script>
