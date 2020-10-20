<template>
  <el-row >
    <el-dialog
      :title="popupTitle"
      :visible.sync="Exportation.IsPopupVisible"
      width="70%"
    >
      <p style="text-align: center; width: 100%;">
        {{popupText}}<br>
      </p>
      <el-progress
        :text-inside="true"
        :stroke-width="18"
        :percentage="loadingProgress"
        :color="progressColor"
      ></el-progress>
    </el-dialog>
    <h2 class="title">Exportation de la table</h2>
    <el-form :inline="true">
      <div class="ProcessForm">
        <el-row :gutter="10" class="ProcessFields">
          <el-col :span="24/nbCol">
            <el-select
              style="width:100%"
              v-model="Exportation.Action"
            >
              <el-option
                v-for="(action, key) in Exportation.ActionsChoice"
                :key="key"
                :label="action"
                :value="key">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="24/nbCol">
            <el-select
              style="width: 100%"
              v-model="Exportation.SelectionMode"
            >
              <el-option
                v-for="(action, key) in Exportation.SelectionModeChoice"
                :key="key"
                :label="action"
                :value="key">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="24/nbCol">
            <el-select
              style="width: 100%"
              v-model="Exportation.from.database_id"
            >
              <el-option
                v-for="(database, key) in databases"
                :key="key"
                :label="database.projectId"
                :value="database.projectId">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="24/nbCol" v-if="databaseDestinationNeeded">
            <el-select
              style="width: 100%"
              v-model="Exportation.to.database_id"
            >
              <el-option
                v-for="(database, key) in databases"
                :key="key"
                :label="database.projectId"
                :disabled="database.projectId === Exportation.from.database_id"
                :value="database.projectId">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="ProcessActions" :gutter="10" style="margin-left: 0px;">
          <el-col :span="12">
            <el-button type="danger" @click="cancel" style="width: 100%">Annuler</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="success" @click="run" style="width: 100%">Exporter</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>

  </el-row>
</template>

<script>
  import databases from '@/Modules/DatabaseManager/DatabaseManager'
  import { mapActions } from 'vuex'

  /**
   * Export a table from an entity between databases. For example to export challenges :
   * ``` html
   * <ExportTable
   v-if="ExportationBehavior.isExport"
   :Model="ChallengeModel"
   :selectionMode="ExportationBehavior.selectionMode"
   :export="results"
   :selection="ExportationBehavior.selection"
   v-on:changeSelectionMode="onChangeSelectionMode"
   v-on:cancel="toogleExport"
   />
   * ```
   */
  export default {
    name: 'export-table',
    props: {
      export: {
        type: [Array],
        default () {
          return []
        }
      },
      Model: {
        type: [Object, Function, Boolean],
        default: false
      },
      ignoreFields: {
        type: Array,
        default () {
          return ['$id', 'id']
        }
      },
      selectionMode: {
        type: Number,
        default: 0
      },
      selection: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        Exportation: {
          ActionsChoice: ['Transférer', 'Remplacer', 'Supprimer'],
          SelectionModeChoice: ['Tout', 'Sélection'],
          SelectionMode: 0,
          Action: 0,
          Process: {
            action: '',
            actionText: '',
            all: [],
            start: [],
            finish: []
          },
          IsPopupVisible: false,
          from: {
            database_id: ''
          },
          to: {
            database_id: ''
          }
        }
      }
    },
    created () {
      this.Exportation.SelectionMode = this.selectionMode
      this.$set(this.Exportation.from, 'database_id', this.currentDatabaseId)
      this.$set(this.Exportation.to, 'database_id', this.exportToTables[0].projectId)
      this.refreshDatabaseId()
      // this.Exportation.from
    },
    computed: {
      entity () {
        return this.Model
      },
      popupTitle () {
        if (this.Exportation.Action === 0) {
          return 'Exportation des ' + this.entity.entity + ' de ' + this.from + ' sur ' + this.to
        }
      },
      popupText () {
        return this.Exportation.Process.all.length + ' ' + this.entity.entity + this.Exportation.Process.actionText + ' sur la base de donnée ' + this.to
      },
      loadingProgress () {
        return Math.round((this.Exportation.Process.finish.length / this.Exportation.Process.all.length) * 100)
      },
      progressColor () {
        if (this.loadingProgress === 100) {
          return '#67c23A'
        }
        return '#409EFF'
      },
      databaseDestinationNeeded () {
        if (this.Exportation.Action !== 2) {
          return true
        }
      },
      nbCol () {
        if (this.Exportation.Action !== 2) {
          return 4
        } else {
          return 3
        }
      },
      dataToProcess () {
        if (this.isAllMode) {
          return this.export
        } else if (this.isSelectionMode) {
          return this.selection
        }
        return []
      },
      currentDatabaseId () {
        return this.$store.getters.currentDatabaseId
      },
      to () {
        return this.Exportation.to.database_id
      },
      from () {
        return this.Exportation.from.database_id
      },
      databases () {
        return [...databases.databasesConfigs, {projectId: 'Local', name: 'Local'}]
      },
      isAllMode () {
        return this.Exportation.SelectionMode === 0
      },
      isSelectionMode () {
        return this.Exportation.SelectionMode === 1
      },
      exportToTables: {
        get () {
          let that = this
          return this.databases.filter((v) => {
            return v.projectId !== that.Exportation.from.database_id
          })
        }
      }
    },
    methods: {
      ...mapActions(['adminChangeCurrentDatabase']),
      run () {
        if (this.Exportation.Action === 0) {
          this.transfer()
        } else if (this.Exportation.Action === 2) {
          this.delete()
        }
      },
      async delete () {
        let processes = await this.$store.dispatch('firestoreDeleteEntities', {
          data: this.dataToProcess,
          entity: this.entity,
          FirestoreId: this.from
        })
        this.Exportation.Process.action = processes.Action
        this.Exportation.Process.all = processes.ToDo
        this.Exportation.Process.actionText = ' à supprimer '
        this.Exportation.IsPopupVisible = true
        processes.ToDo.forEach(v => {
          this.Exportation.Process.start.push(v)
          v.then(r => {
            this.Exportation.Process.finish.push(r)
            // console.log('Request done')
            // console.log(r)
          })
        })
      },
      async transfer () {
        let processes = await this.$store.dispatch('firestoreAddEntities', {
          data: this.dataToProcess,
          ignoreFields: this.ignoreFields,
          entity: this.entity,
          FirestoreId: this.to
        })
        this.Exportation.Process.action = processes.Action
        this.Exportation.Process.all = processes.ToDo
        this.Exportation.Process.actionText = ' à copier ou remplacer '
        this.Exportation.IsPopupVisible = true
        processes.ToDo.forEach(v => {
          this.Exportation.Process.start.push(v)
          v.then(r => {
            this.Exportation.Process.finish.push(r)
            // console.log('Request done')
            // console.log(r)
          })
        })
      },
      cancel () {
        this.$emit('cancel')
      },
      refreshDatabaseId () {
        if (this.currentDatabaseId !== this.Exportation.from.database_id) {
          // this.$set(this.Exportation.from, 'database_id', this.currentDatabaseId)
        }
        if (this.Exportation.from.database_id === this.Exportation.to.database_id) {
          this.$set(this.Exportation.to, 'database_id', this.exportToTables[0].projectId)
        }
      }
    },
    watch: {
      currentDatabaseId () {
        if (this.currentDatabaseId !== this.Exportation.from.database_id) {
          this.$set(this.Exportation.from, 'database_id', this.currentDatabaseId)
        }
        // this.refreshDatabaseId()
      },
      from () {
        if (this.currentDatabaseId !== this.Exportation.from.database_id) {
          this.adminChangeCurrentDatabase(this.Exportation.from.database_id)
        }
      },
      isSelectionMode () {
        this.$emit('changeSelectionMode', this.Exportation.SelectionMode, this.Exportation.SelectionMode[this.Exportation.SelectionModeChoice])
      },
      Exportation: {
        deep: true,
        handler (val, old) {
          // if (this.Exportation.from.database_id === this.Exportation.to.database_id) {
          this.refreshDatabaseId()
          // if (that.Exportation.to.database_id === this.Exportation.to.database_id) {
          //   that.Exportation.from.database_id = this.databases.first((v) => {
          //     return v.projectId !== that.Exportation.to.database_id
          //   }).projectId
          // }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ProcessForm {
    display: flex;
    /*width: 100%;*/
    /*justify-content: space-around;*/
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: stretch;
    .ProcessFields {
      flex-grow: 1;
      width: auto;
      align-self: stretch;
    }
    .ProcessActions {
      margin-left: 10px;
      width: 250px;
    }
  }
</style>
