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
      <el-select v-model="LogicGroup.requirements" multiple placeholder="selectionnez des prérequis">
        <el-option
          v-for="item in requirementOptions"
          :key="item.value"
          :label="item.label"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Groupes logiques:">
      <el-select v-model="LogicGroup.logicGroups" value-key="label" multiple placeholder="selectionnez des groupes logiques">
        <el-option
          v-for="item in groupOptions"
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
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <component :is="type.value" :mode=LogicGroup @add="add($event)" @save="save($event)" @addCollection="addCollection($event)" @saveCollection="saveCollection($event)">
        </component>
      </el-card>
      <visualRender
        :logicGroup="LogicGroup"
        :type="type"
      />
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
      <el-button @click="saveLogicGroup" type="success">Enregistrer le groupe logique</el-button>
    </el-form>
  </div>
</template>

<script>
  import PeriodDate from './periodDate'
  import VisualRender from './visualRender'
  import CollectionForm from './collectionForm'

  export default {
    components: {
      PeriodDate,
      VisualRender,
      CollectionForm
    },
    name: 'AdminRequirementForm',
    data () {
      return {
        typeOptions: [
          {
            value: 'CollectionForm',
            label: 'Collection',
            displayName: 'test'
          },
          {
            value: 'PeriodDate',
            label: 'Intervalle de temps',
            displayName: 'Pendant'
          }
        ],
        logicOptions: ['ET', 'OU'],
        requirementOptions: [],
        groupOptions: [],
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
      // logicGroupObject () {
      //   return this.LogicGroup.logicGroups.map((logicGroup) => {
      //     return this.groupOptions.find((groupOption) => {
      //       return groupOption.label === logicGroup.label
      //     })
      //   })
      // }
    },
    methods: {
      add (event) {
        this.LogicGroup.logicGroups.push(event)
        this.clear()
      },
      clear () {
        this.type = {}
      },
      deleteElement (item, element) {
        this.LogicGroup[element].splice(item, 1)
      },
      save (event) {
        this.groupOptions.push(event)
        this.clear()
      },
      saveCollection (event) {
        this.requirementOptions.push(event)
        this.clear()
      },
      addCollection (event) {
        this.LogicGroup.requirements.push(event)
        this.clear()
      },
      saveLogicGroup () {
      }
      // saveRequirement () {
      // }
    }
  }
</script>