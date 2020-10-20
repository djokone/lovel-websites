<template>
  <div>
    <el-form ref="form" :model="LogicGroup" label-width="177px" label-position="left">
      <h2>Ajouter un groupe logique</h2><br>
    <el-form-item label="Label:">
      <el-input v-model="LogicGroup.label"></el-input>
    </el-form-item>
    <el-form-item label="Inverser:">
      <el-switch v-model="LogicGroup.isRequired">
      </el-switch>
    </el-form-item>
    <el-form-item label="Opérateur logique:">
      <el-select v-model="LogicGroup.logicOperator" placeholder="selectionnez un opérateur logique">
        <el-option
          v-for="item in logicOptions"
          :key="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Prérequis prédefinis:">
      <el-select v-model="LogicGroup.requirements" value-key="label" multiple placeholder="selectionnez des prérequis">
        <el-option
          v-for="item in requirementsArray"
          :key="item.value"
          :label="item.label"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Groupes logiques:">
      <el-select v-model="LogicGroup.logicGroups" value-key="label" multiple placeholder="selectionnez des groupes logiques">
        <el-option
          v-for="item in logicGroupsArray"
          :key="item.label"
          :label="item.label"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
      <el-card>
        <h3>Ajouter des prérequis</h3><br>
        <el-form-item label="Type de prérequis:">
          <el-select v-model="type" placeholder="selectionnez un type de prérequis">
            <el-option
              v-for="item in typeOptions"
              :key="item.label"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <component :is="type.value"
        @add="add($event)" @save="save($event)">
        </component>
      </el-card>
      <!-- <visualRender
        :logicGroup="LogicGroup"
        :type="type"
      /> -->
      <br><el-card>
        <el-form-item label="Liste des prérequis:">
          <li v-for="(item, key) in LogicGroup.requirements" :key="key">
            {{item.label}}
            <el-button type="danger" style="float: right;" icon="el-icon-delete" circle @click="deleteElement(item, 'requirements')"></el-button>
          </li>
        </el-form-item>
        <el-form-item label="Liste des groupes logiques:">
          <li v-for="(item, key) in LogicGroup.logicGroups" :key="key">
            {{item.label}}
            <el-button type="danger" style="float: right;" icon="el-icon-delete" circle @click="deleteElement(item, 'logicGroups')"></el-button>
          </li>
        </el-form-item>
      </el-card>
      <el-button @click="saveLogicGroup(LogicGroup)" type="success">Enregistrer le groupe logique</el-button>
    </el-form>
  </div>
</template>

<script>
  import PeriodDate from './periodDate'
  import VisualRender from './visualRender'
  import CollectionForm from './collectionForm'
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'
  import { mapActions } from 'vuex'

  export default {
    components: {
      PeriodDate,
      VisualRender,
      CollectionForm
    },
    name: 'AdminRequirementForm',
    mixins: [LoadCurrentDatabase],
    load: {
      actions: ['adminLoadLogicGroups', 'adminLoadRequirements'],
      getters: ['requirements', 'logicGroups']
    },
    data () {
      return {
        typeOptions: [
          {
            value: 'CollectionForm',
            label: 'Collection',
            mode: 'Requirement',
            displayName: 'test'
          },
          {
            value: 'PeriodDate',
            label: 'Intervalle de temps',
            mode: 'LogicGroups',
            displayName: 'Pendant'
          }
        ],
        logicOptions: ['ET', 'OU'],
        requirementOptions: [],
        type: {},
        LogicGroup: {
          label: '',
          isRequired: false,
          requirements: [],
          logicGroups: [],
          logicOperator: ''
        }
      }
    },
    computed: {
      logicGroupsArray () {
        return this.getters.logicGroups
      },
      requirementsArray () {
        return this.getters.requirements
      },
      debug () {
        return this.$store.getters.debug
      }
    },
    methods: {
      ...mapActions(['adminAddPredefinedLogicGroup', 'adminAddPredefinedRequirement']),
      addLogicGroup (event) {
        this.LogicGroup.logicGroups.push(event)
        this.clear()
      },
      clear () {
        this.type = {}
      },
      add (event) {
        if (this.type.mode === 'Requirement') {
          this.addRequirement(event)
        } else {
          this.addLogicGroup(event)
        }
      },
      save (event) {
        if (this.type.mode === 'Requirement') {
          this.saveRequirement(event)
        } else {
          this.saveLogicGroup(event)
        }
      },
      deleteElement (item, element) {
        this.LogicGroup[element].splice(item, 1)
      },
      saveLogicGroup (event) {
        for (let i = 0; i !== event.requirements.length; i++) {
          event.requirements[i] = {...event.requirements[i]}
        }
        for (let i = 0; i !== event.logicGroups.length; i++) {
          event.logicGroups[i] = {...event.logicGroups[i]}
        }
        this.saveAsPredefinedLogicGroup(event)
        this.clear()
      },
      saveRequirement (event) {
        this.saveAsPredefinedRequirement(event)
        this.clear()
      },
      addRequirement (event) {
        this.LogicGroup.requirements.push(event)
        this.clear()
      },
      saveAsPredefinedRequirement (Requirement) {
        this.adminAddPredefinedRequirement({
          toSave: Requirement,
          verbose: this.debug,
          preSave: false
        })
      },
      saveAsPredefinedLogicGroup (LogicGroup) {
        this.adminAddPredefinedLogicGroup({
          toSave: LogicGroup,
          verbose: this.debug,
          preSave: false
        })
      }
    }
  }
</script>
