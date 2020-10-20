<template>
  <div>
    <el-form class="form"
             :model="newChange"
             :label-position="labelPosition"
             label-width="200px"
             v-if="interest">
      <el-form-item label="Libellé">
        <el-input v-model="newChange.name" id="name"/>
      </el-form-item>
      <!--<el-form-item label="Parent">
        <el-cascader
          v-model="newChange.parent_id"
          :options="interestsList"
          :clearable="true"
          :props="props"
          placeholder="Selectionner un parent"></el-cascader>
      </el-form-item>-->
      <el-form-item label="Parent">
        <el-select
          filterable
          default-first-option
          v-model="newChange.parent_id"
          placeholder="Ajouter un centre d'intéret parent"
          size="large"
          style="width: 100%">
          <el-option
            v-for="interet in interestsList"
            :value="interet.id"
            :key="interet.id"
            :label="interet.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Labels" v-if="tagManager">
        <tag-manager :interestId="interest.id" :tags="tags" v-if="interest"></tag-manager>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="edit" v-if="isEdit">Enregistrer</el-button>
        <el-button type="success" @click="edit" v-if="isAdd">Ajouter</el-button>
        <el-button type="danger" @click="resetForm('addInteretForm')" v-if="isAdd">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import { mapActions } from 'vuex'
  import TagManager from '@/Modules/Tags/Templates/TagManager'
  export default {
    components: {TagManager},
    name: 'admin-interest-edit',
    created () {
      this.updateNewChange()
    },
    props: {
      isLoading: {
        type: Boolean,
        default: false
      },
      mode: {
        type: String,
        default: 'edit'
      },
      primaryKey: {
        type: String,
        default: 'id'
      },
      labelPosition: {
        type: String,
        default: 'right'
      },
      tagManager: {
        type: Boolean,
        default: false
      },
      interest: {
        type: Object,
        default () {
          return {}
        }
      },
      interestsList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        props: {
          label: 'name',
          value: 'id'
        },
        newChange: {
        }
      }
    },
    computed: {
      debug () {
        return this.$store.getters.debug
      },
      database () {
        return this.$store.getters.currentDatabaseId
      },
      getUid () {
        if (this.edit) {
          return (this.interest[this.primaryKey]) ? this.interest[this.primaryKey] : this.$route.params.id
        } else {
          return false
        }
      },
      tags () {
        if (this.interest.tags) {
          return this.interest.tags
        } else {
          return false
        }
      },
      hasTags () {
        return this.interet && this.interet.tags
      },
      isEdit () {
        return this.mode === 'edit'
      },
      isAdd () {
        return this.mode === 'add'
      },
      isInterestLoaded () {
        return this.interestList.length > 0
      },
      isInteretLoaded () {
        return this.interest
      },
      toSave () {
        return this.newChange
      }
    },
    watch: {
      interest () {
        this.updateNewChange()
      }
    },
    methods: {
      ...mapActions(['adminEditInterests', 'adminFirestoreAddInterests']),
      updateNewChange () {
        this.newChange = cloneDeep(this.interest)
      },
      editResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le défi "' + this.interest.name + '", a bien été modifié'
        })
      },
      addResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le défi "' + this.interest.name + '", a bien été ajouté'
        })
      },
      edit () {
        let that = this
        this.adminEditInterests({
          id: this.getUid,
          toSave: this.newChange,
          verbose: this.debug
        }).then(() => {
          if (that.isEdit) {
            that.editResponse()
          } else if (that.isAdd) {
            that.addResponse()
          }
        }).catch(function (e) {
          console.error(e)
          that.$notify.error({
            title: 'Erreur',
            message: 'Une erreur lors de la modification du centre d\'intéret '
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
