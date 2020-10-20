<template>
  <div>
    <h4>Ajouter un prérequis de collection de comparaison</h4>
    <el-form label-width="150px" label-position="left">
      <el-form-item label="Collection:">
        <el-select v-model="newValueToCompare.collection" placeholder="selectionnez une collection">
          <el-option v-for="(collection, key) in collectionsArray" :key='key' :value="key" :label="collection">
          </el-option>
        </el-select>
        <el-button type="warning" @click="clearCollection">Reset</el-button>
      </el-form-item>
      <el-form-item label="Sous-collection:">
        <el-select v-model="newValueToCompare.subCollections[0]" placeholder="selectionnez une sous-collection">
          <el-option
            v-for="(collection, key) in subCollectionsArray" :key='key' :value="collection" :label="collection">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Sous-collection:" v-for="(subcol, key) in newValueToCompare.subCollections" :key="key">
        <el-select v-model="newValueToCompare.subCollections[key + 1]" placeholder="selectionnez une sous-collection">
          <el-option
            v-for="(collection, key) in subCollectionsArray" :key='key' :value="collection" :label="collection">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Champ:">
        <el-select v-model="newValueToCompare.field" placeholder="selectionnez un champ">
          <el-option v-for="(collection, key) in fieldsArray" :key='key' :value="key" :label="collection">
          </el-option>
        </el-select>
        <el-button type="primary" @click="saveValue">Enregistrer la valeur de comparaison</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ModelBehavior from '@/Modules/DatabasesManager/Mixins/ModelBehavior'
  import DatabasesBehavior from '@/Modules/DatabasesManager/Mixins/DatabasesBehavior'
  import store from '@/config/store'

  export default {
    name: 'compareCollections',
    mixins: [ModelBehavior, DatabasesBehavior],
    data () {
      return {
        subCollectionsArrayOfModelSto: [],
        newValueToCompare: {
          collection: '',
          subCollections: [],
          field: '',
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
        return this.newValueToCompare.subCollections.length === 0
      },
      fieldsObject () {
        if (this.newValueToCompare.collection.length !== 0 && this.hasSubCollection) {
          return this.currentDatabaseCollections[this.newValueToCompare.collection].model.getFields()
        } else if (this.newValueToCompare.collection.length !== 0 && !this.hasSubCollection) {
          return this.subCollectionsArrayOfModelSto[this.newValueToCompare.subCollections.length - 1].getFields()
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
      valueToCompare () {
        let valueToCompare = this.collectionsArray[this.newValueToCompare.collection] + '.'
        for (let i = 0; i !== this.newValueToCompare.subCollections.length; i++) {
          valueToCompare += this.newValueToCompare.subCollections[i] + '.'
        }
        valueToCompare += this.fieldsArray[this.newValueToCompare.field]
        return valueToCompare
      }
    },
    methods: {
      setModelStorage (subCollections) {
        for (let i = 0; i < subCollections.length; i++) {
          this.subCollectionsArrayOfModelSto.push(subCollections[i])
        }
      },
      clearCollection () {
        this.newValueToCompare.collection = ''
        this.subCollectionsArrayOfModelSto = []
        this.newValueToCompare.subCollections = []
        this.newValueToCompare.valueToCompare = ''
        this.newValueToCompare.field = ''
      },
      saveValue () {
        this.newValueToCompare.valueToCompare = this.valueToCompare
        this.$emit('save', this.newValueToCompare.valueToCompare)
      }
    }
  }
</script>
