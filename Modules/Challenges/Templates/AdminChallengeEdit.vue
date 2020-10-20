<template>
  <div>
    <el-form class="form"
             :model="newChange"
             :label-position="labelPosition"
             label-width="200px"
             v-if="challenge">
      <el-form-item label="Titre du défi">
        <el-input v-model="newChange.name" id="name"/>
      </el-form-item>
      <el-form-item label="Type de jeu">
        <el-select
          v-model="newChange.game_id"
          filterable
          style="width: 100%"
          placeholder="Select"
          v-if="isGamesLoaded">
          <el-option
            v-for="game in gamesList"
            :value="game.id"
            :label="game.name"
            :key="game.id"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Description du défi">
        <el-input v-model="newChange.description" type="textarea" id="description"></el-input>
      </el-form-item>
      <el-form-item label="Centre d'intéret" v-if="hasInterestList">
        <el-select
          multiple
          filterable
          v-model="newChange.interests_ids"
          placeholder="Ajouter des centres d'intérets"
          size="large"
          style="width: 100%"
          v-if="hasInterestList">
          <el-option
              v-if="hasInterestList"
              v-for="interet in interestList"
              :value="interet.id"
              :label="interet.name"
              :key="interet.id"
          >{{interet.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Type de défis" v-if="hasTypeList">
        <el-select
          multiple
          filterable
          v-model="newChange.type_id"
          placeholder="Ajouter des types de défis"
          size="large"
          style="width: 100%"
          v-if="hasTypeList">
          <el-option
              v-if="hasTypeList"
              v-for="type in typeList"
              :value="type.id"
              :label="type.name"
              :key="type.id"
          >{{type.name}}</el-option>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Online">
        <el-switch v-model="newChange.online"></el-switch>
      </el-form-item>
      <el-form-item label="Imaginé par">
        <el-select
          v-model="newChange.creatorId"
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
      <el-form-item>
        <el-button type="primary" @click="edit" v-if="isEdit">Enregistrer</el-button>
        <el-button type="success" @click="edit" v-if="isAdd">Ajouter</el-button>
        <el-button type="warning" @click="toogleLogicGroup">Ajouter un groupe logique</el-button>
      </el-form-item>
    </el-form>
    <div>
      <div>
        <h3 class="small-title">Ajouter des exigences</h3>
      </div>
      <div class="addedRequirement">
        <div class="requirement" v-for="(requirement, key) in challenge.required">
          {{requirement}}
          {{key}}
        </div>
      </div>
    </div>
    <div v-if="showLogicGroup">
      <AdminRequirementForm/>
    </div>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import { mapActions } from 'vuex'
  import AdminRequirementForm from '@/Modules/Requirements/Templates/AdminRequirementForm'
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'

  export default {
    name: 'admin-challenge-edit',
    components: {
      AdminRequirementForm
    },
    created () {
      if (this.isEdit) {
        this.updateNewChange()
      }
    },
    mixins: [LoadCurrentDatabase],
    load: {
      actions: ['adminLoadUsers'],
      getters: ['users']
    },
    props: {
      mode: {
        type: String,
        default: 'edit'
      },
      // isLoading: {
      //   type: Boolean,
      //   default: true
      // },
      labelPosition: {
        type: String,
        default: 'left'
      },
      challenge: {
        type: Object,
        default () {
          return {}
        }
      },
      interestList: {
        type: Array,
        default () {
          return []
        }
      },
      gamesList: {
        type: Array,
        default () {
          return []
        }
      },
      typeList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        options: this.usersArray,
        loading: false,
        showLogicGroup: false,
        newChange: {
          game_id: null,
          interests_ids: [],
          type_id: [],
          online: false
        }
      }
    },
    computed: {
      list () {
        return this.usersArray.map(item => {
          return { value: item.id, label: item.displayName }
        })
      },
      usersArray () {
        return this.getters.users
      },
      debug () {
        return this.$store.getters.debug
      },
      hasInterestList () {
        if (!this.interestList) {
          return false
        }
        return true
      },
      hasTypeList () {
        if (!this.typeList) {
          return false
        }
        return true
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
      isGamesLoaded () {
        return this.gamesList.length > 0
      },
      isChallengeLoaded () {
        return this.challenge
      },
      toSave () {
        return this.newChange
      }
    },
    watch: {
      challenge () {
        this.updateNewChange()
      }
    },
    methods: {
      ...mapActions(['adminEditChallenges', 'adminAddChallenges']),
      updateNewChange () {
        this.newChange = cloneDeep(this.challenge)
        // Init interest ids
        if (this.challenge && (typeof this.challenge.interests_ids === 'undefined' || this.challenge.interests_ids === null)) {
          this.newChange['interests_ids'] = []
        }
        if (this.challenge && typeof this.challenge.game_id === 'undefined') {
          this.newChange['game_id'] = null
        }
        if (this.challenge && (typeof this.challenge.type_id === 'undefined' || this.challenge.type_id === null)) {
          this.newChange['type_id'] = []
        }
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
      },
      toogleLogicGroup () {
        this.showLogicGroup = !this.showLogicGroup
      },
      editResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le défi "' + this.newChange.name + '", a bien été modifié'
        })
      },
      addResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le défi "' + this.newChange.name + '", a bien été ajouté'
        })
      },
      edit () {
        let that = this
        this.adminEditChallenges({
          id: this.isEdit ? this.$route.params.id : false,
          toSave: this.newChange,
          verbose: this.debug
        }).then(() => {
          that.$emit('save', {
            mode: this.mode
          })
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
