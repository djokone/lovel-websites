<template>
  <div>
    <br><h4>Créer un prérequis de collection</h4>
    <el-form label-width="150px" label-position="left">
      <el-form-item label="Label:">
        <el-input v-model="newCollectionRequirement.label"></el-input>
      </el-form-item>
      <el-form-item label="Collection:">
        <el-select v-model="collection" placeholder="selectionnez une collection">
          <el-option v-for="(collection, key) in collectionsArray" :key='key' :value="key" :label="collection">
          </el-option>
        </el-select>
        <el-button type="warning" @click="clearCollection">Reset</el-button>
      </el-form-item>
      <el-form-item label="Sous-collection:">
        <el-select v-model="subCollections[0]" placeholder="selectionnez une sous-collection">
          <el-option
            v-for="(collection, key) in subCollectionsArray" :key='key' :value="collection" :label="collection">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Sous-collection:" v-for="(subcol, key) in subCollections" :key="key">
        <el-select v-model="subCollections[key + 1]" placeholder="selectionnez une sous-collection">
          <el-option
            v-for="(collection, key) in subCollectionsArray" :key='key' :value="collection" :label="collection">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Champ:">
        <el-select v-model="field" placeholder="selectionnez un champ">
          <el-option v-for="(collection, key) in fieldsArray" :key='key' :value="key" :label="collection">
          </el-option>
        </el-select>
        <el-button type="primary" @click="saveValue">Enregistrer la valeur</el-button>
      </el-form-item>
      <el-form-item label="Opérateur logique:">
        <el-select v-model="newCollectionRequirement.logicOperator" placeholder="selectionnez un opérateur logique">
          <el-option
            v-for="item in logicOption"
            :key="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Mode:">
        <el-select v-model="newCollectionRequirement.type" placeholder="selectionnez un mode de comparaison">
          <el-option
            v-for="item in modeOption"
            :key="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="newCollectionRequirement.type=='CollectionToCollection'">
        <compareCollections @save="save($event)"/>
      </el-form-item>
      <el-form-item v-if="newCollectionRequirement.type=='CollectionToValue'" label="Type (facultatif):">
        <el-select v-model="typeValue" placeholder="selectionnez un type de prérequis">
        </el-select>
        <el-card label="ValueToCompare"></el-card>
      </el-form-item>
    </el-form>
    <el-button type="success" @click="saveRequirement">Sauvegarder le prérequis</el-button>
    <el-button type="primary" @click="addRequirement">Ajouter le prérequis</el-button>
  </div>
</template>

<script>
  import ModelBehavior from '@/Modules/DatabasesManager/Mixins/ModelBehavior'
  import DatabasesBehavior from '@/Modules/DatabasesManager/Mixins/DatabasesBehavior'
  import store from '@/databases'
  import compareCollections from '@/Modules/Challenges/Templates/compareCollections'

  export default {
    name: 'CollectionForm',
    components: {
      compareCollections
    },
    mixins: [ModelBehavior, DatabasesBehavior],
    data () {
      return {
        subCollectionsArrayOfModelSto: [],
        logicOption: ['=', '=<', '>='],
        modeOption: ['CollectionToCollection', 'CollectionToValue'],
        typeValue: '',
        collection: '',
        subCollections: [],
        field: '',
        newCollectionRequirement: {
          type: '',
          label: '',
          logicOperator: '',
          value: '',
          valueToCompare: ''
        }
      }
    },
    computed: {
      currentDatabaseCollections () {
        return store.database.entities
      },
      collectionsArray () {
        return this.currentDatabaseCollections.map((collection) => {
          return collection.name
        })
      },
      hasSubCollection () {
        return this.subCollections.length === 0
      },
      fieldsObject () {
        if (this.collection.length !== 0 && this.hasSubCollection) {
          return this.currentDatabaseCollections[this.collection].model.getFields()
        } else if (this.collection.length !== 0 && !this.hasSubCollection) {
          return this.subCollectionsArrayOfModelSto[this.subCollections.length - 1].getFields()
        }
      },
      subCollectionsArrayOfModel () {
        let subCollections = []
        for (let field in this.fieldsObject) {
          if (typeof this.fieldsObject[field].related === 'function') {
            subCollections.push(this.fieldsObject[field].related)
          }
        }
        this.setModelStorage(subCollections)
        return subCollections
      },
      subCollectionsArray () {
        if (this.checkIfMultipleSelection) {
          return []
        } else {
          return this.subCollectionsArrayOfModel.map((model) => {
            return model.name
          })
        }
      },
      fieldsArray () {
        if (this.fieldsObject) {
          return Object.keys(this.fieldsObject)
        } else {
          return []
        }
      },
      checkIfMultipleSelection () {
        let index = 0
        for (let i = 0; i !== this.subCollectionsArrayOfModelSto.length; i++) {
          for (let j = 0; j !== this.subCollectionsArrayOfModel.length; j++) {
            if (this.subCollectionsArrayOfModelSto[i] === this.subCollectionsArrayOfModel[j]) {
              index += 1
            }
          }
        }
        return index > 1
      },
      value () {
        let value = this.collectionsArray[this.collection] + '.'
        for (let i = 0; i !== this.subCollections.length; i++) {
          value += this.subCollections[i] + '.'
        }
        value += this.fieldsArray[this.field]
        return value
      }
    },
    methods: {
      setModelStorage (subCollections) {
        for (let i = 0; i < subCollections.length; i++) {
          this.subCollectionsArrayOfModelSto.push(subCollections[i])
        }
      },
      clearCollection () {
        this.collection = ''
        this.subCollectionsArrayOfModelSto = []
        this.subCollections = []
        this.field = ''
      },
      saveValue () {
        this.newCollectionRequirement.value = this.value
      },
      save (event) {
        this.newCollectionRequirement.valueToCompare = event
      },
      saveRequirement () {
        this.$emit('saveCollection', this.newCollectionRequirement)
      },
      addRequirement () {
        this.$emit('addCollection', this.newCollectionRequirement)
      }
    }
  }
</script>
