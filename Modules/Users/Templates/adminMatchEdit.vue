<template>
  <div>
    <el-form class= "form"
      :model="newChange"
      :label-position="labelPosition"
      label-width="200px"
      v-if="match">
      <el-form-item label="Id compte n°1">
        <el-input v-model="newChange.from_user_id" id="from_user_id"/>
      </el-form-item>
      <el-form-item label="Id compte n°2">
        <el-input v-model="newChange.to_user_id" id="to_user_id"/>
      </el-form-item>
      <el-form-item label="Etat">
        <el-input v-model="newChange.state" id="state"/>
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
    name: 'adminMatchEdit',
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
      match: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        props: {
          label: 'id',
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
          return (this.match[this.primaryKey]) ? this.match[this.primaryKey] : this.$route.params.id
        } else {
          return false
        }
      },
      isEdit () {
        return this.mode === 'edit'
      },
      isAdd () {
        return this.mode === 'add'
      },
      toSave () {
        return this.newChange
      }
    },
    watch: {
      match () {
        this.updateNewChange()
      }
    },
    methods: {
      ...mapActions(['adminEditMatch', 'adminAddMatch']),
      updateNewChange () {
        this.newChange = cloneDeep(this.match)
      },
      editResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le match d\'id "' + this.newChange.id + '", a bien été ajouté'
        })
      },
      addResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le match d\'id "' + this.newChange.id + '", a bien été modifié'
        })
      },
      edit () {
        let that = this
        this.adminEditMatch({
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
            message: 'Une erreur lors de la modification du match'
          })
        })
      }
    }
  }
</script>
