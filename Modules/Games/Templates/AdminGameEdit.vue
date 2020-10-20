<template>
  <div>
    <el-form class="form"
             :model="newChange"
             :label-position="labelPosition"
             label-width="200px"
             v-if="Game">
    <el-form-item label="Nom du jeu">
      <el-input v-model="newChange.name" id="name"/>
    </el-form-item>
    <el-form-item label="Types">
      <el-select v-model="newChange.type" multiple placeholder="selectionnez un type">
        <el-option
          v-for="item in types"
          :key="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="En ligne">
      <el-switch v-model="newChange.online"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="edit" v-if="isEdit">Enregistrer</el-button>
      <el-button type="success" @click="edit" v-if="isAdd">Ajouter</el-button>
    </el-form-item>
  </el-form>
  <div>
    <div>
      <h3 class="small-title">Ajouter des exigences</h3>
      </div>
    </div>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import { mapActions } from 'vuex'
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'

  export default {
    name: 'admin-Game-edit',
    created () {
      this.updateNewChange()
    },
    mixins: [LoadCurrentDatabase],
    load: {
      actions: ['adminLoadTypes'],
      getters: ['types']
    },
    props: {
      mode: {
        type: String,
        default: 'edit'
      },
      labelPosition: {
        type: String,
        default: 'left'
      },
      Game: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        newChange: {
        }
      }
    },
    computed: {
      isEdit () {
        return this.mode === 'edit'
      },
      isAdd () {
        return this.mode === 'add'
      },
      isInterestLoaded () {
        return this.interestList.length > 0
      },
      isGameLoaded () {
        return this.Game
      },
      toSave () {
        return this.newChange
      },
      types () {
        return this.getters.types
      }
    },
    watch: {
      Game () {
        this.updateNewChange()
      }
    },
    methods: {
      ...mapActions(['adminEditGames', 'adminAddGames']),
      updateNewChange () {
        this.newChange = cloneDeep(this.Game)
      },
      editResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le défi "' + this.Game.name + '", a bien été modifié'
        })
      },
      addResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le défi "' + this.Game.name + '", a bien été ajouté'
        })
      },
      edit () {
        let that = this
        this.adminEditGames({
          uid: this.isEdit ? this.$route.params.id : false,
          toSave: this.newChange
        }).then(() => {
          if (that.isEdit) {
            that.editResponse()
          } else if (that.isAdd) {
            that.addResponse()
          }
        })
        .catch(function (e) {
          console.error(e)
          that.$notify.error({
            title: 'Erreur',
            message: 'Une erreur lors de la modification du défi '
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
