<template>
  <div>
    <el-form class= "form"
      :model="newChange"
      :label-position="labelPosition"
      label-width="200px"
      v-if="match">
      <el-form-item label="Id" v-if="isEdit">
        <el-input v-model="newChange.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="Utilisateur 1">
        <el-select
          v-model="newChange.from_user_id"
          filterable
          remote
          reserve-keyword
          placeholder="Entrez un nom d'utilisateur"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isEdit">
        <el-input v-model="userNames.from_user_id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="Utilisateur 2">
        <el-select
          v-model="newChange.to_user_id"
          filterable
          remote
          reserve-keyword
          placeholder="Entrez un nom d'utilisateur"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isEdit">
        <el-input v-model="userNames.to_user_id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="Etat">
        <el-input v-model="newChange.state" id="state"/>
      </el-form-item>
      <el-form-item label="Niveau">
        <el-input-number v-model="newChange.level" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="float: right" @click="edit" v-if="isEdit">Enregistrer</el-button>
        <el-button type="success" style="float: right" @click="add" v-if="isAdd">Ajouter</el-button>
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
        options: this.usersArray,
        loading: false,
        props: {
          label: 'id',
          value: 'id'
        },
        newChange: {
        }
      }
    },
    computed: {
      userNames () {
        let userNames = {}
        for (let item in this.usersArray) {
          if (this.usersArray[item].id === this.newChange.from_user_id) {
            userNames.from_user_id = this.usersArray[item].displayName
          } else if (this.usersArray[item].id === this.newChange.to_user_id) {
            userNames.to_user_id = this.usersArray[item].displayName
          }
        }
        return userNames
      },
      list () {
        return this.usersArray.map(item => {
          return { value: item.id, label: item.displayName }
        })
      },
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
      },
      usersArray () {
        return this.$store.getters[this.database + '/users/query']().get()
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
          message: 'Le match d\'id "' + this.newChange.id + '", a bien été modifié'
        })
      },
      addResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le match d\'id "' + this.newChange.id + '", a bien été ajouté'
        })
      },
      edit () {
        let that = this
        this.adminEditMatch({
          id: this.getUid,
          toSave: this.newChange,
          verbose: this.debug
        }).then(() => {
          that.editResponse()
        }).catch(function (e) {
          console.error(e)
          that.$notify.error({
            title: 'Erreur',
            message: 'Une erreur lors de la modification du match'
          })
        })
      },
      add () {
        let that = this
        this.adminAddMatch({
          data: this.newChange,
          verbose: this.debug
        }).then(() => {
          that.addResponse()
        }).catch(function (e) {
          console.error(e)
          that.$notify.error({
            title: 'Erreur',
            message: 'Une erreur lors de l\'ajout du match'
          })
        })
      },
      remoteMethod (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.options = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.options = []
        }
      }
    }
  }
</script>
