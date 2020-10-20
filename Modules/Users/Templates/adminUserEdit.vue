<template>
  <div>
    <el-form class="form"
             :model="newChange"
             :label-position="labelPosition"
             label-width="200px"
             v-if="user">
      <el-form-item label="Id" v-if="isEdit">
        <el-input v-model="newChange.id" id="id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="Nom d'utilisateur">
        <el-input v-model="newChange.displayName" id="displayName"/>
      </el-form-item>
      <el-form-item label="Adresse email">
        <el-input v-model="authInfos.email" id="Adresse email"/>
      </el-form-item>
      <el-form-item label="Prénom">
        <el-input v-model="newChange.firstname" id="firstname"/>
      </el-form-item>
      <el-form-item label="Nom">
        <el-input v-model="newChange.lastname" id="lastname"/>
      </el-form-item>
      <el-form-item label="Date de naissance">
        <div class="block">
          <el-date-picker
            v-model="newChange.birthdate"
            type="date"
            placeholder="Choississez un jour"
            format="dd/MM/yyyy"
            value-format="dd/MM/yyyy">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="Rôle">
        <el-select v-model="authInfos.role" placeholder="selectionnez un role" id="role">
          <el-option
            v-for="item in roleOptions"
            :key="item"
            :value="item">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Genre">
        <el-input v-model="newChange.gender" id="gender"/>
      </el-form-item>
      <el-form-item label="Ville">
        <el-input v-model="newChange.city" id="city"/>
      </el-form-item>
      <el-form-item label="Genre(s) recherché(s)">
        <el-select v-model="newChange.researchGender" placeholder="selectionnez le(s) genre(s) recherché(s)" multiple>
          <el-option
            v-for="item in genderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Distance de recherche">
        <el-slider v-model="newChange.researchDistance"></el-slider>
      </el-form-item>
      <el-form-item label="Tranche d'âge recherchée">
        <el-slider
          v-model="researchAge"
          range
          :show-stops=false
          :max="100">
        </el-slider>
      </el-form-item>
      <el-form-item label="Onboard">
        <el-switch v-model="newChange.onboard"></el-switch>
      </el-form-item>
      <el-form-item label ="Type de relation recherchée">
        <el-select v-model="newChange.researchRelationKind" placeholder="selectionnez le ou les types de relations recherchés" multiple>
          <el-option
            v-for="item in relationKinds"
            :key="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label ="Description">
        <el-input type="textarea" v-model="newChange.description" id="lastname"/>
      </el-form-item>
      <el-form-item v-if="mode=='add'" label="Mot de passe">
        <el-input v-model="authInfos.password" id="Mot de passe" type="password"/>
      </el-form-item>
      <el-form-item v-if="messages!==0" label="Messages">
        <el-progress :text-inside="true" :stroke-width="26" status="warning" :percentage="interactionsProportion.messages"></el-progress>
      </el-form-item>
      <el-form-item v-if="challenges!==0" label="Challenges">
        <el-progress :text-inside="true" :stroke-width="26" status="exception" :percentage="interactionsProportion.challenges"></el-progress>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="edit" v-if="isEdit">Enregistrer</el-button>
        <el-button type="success" @click="create" v-if="isAdd">Ajouter</el-button>
        <el-button type="danger" @click="resetForm('addInteretForm')" v-if="isAdd">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import { mapActions } from 'vuex'
  import TagManager from '@/Modules/Tags/Templates/TagManager'
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'

  export default {
    components: {TagManager},
    name: 'adminUserEdit',
    mixins: [LoadCurrentDatabase],
    created () {
      this.updateNewChange()
    },
    load: {
      actions: ['adminLoadAuths']
    },
    props: {
      // isLoading: {
      //   type: Boolean,
      //   default: false
      // },
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
      user: {
        type: Object,
        default () {
          return {}
        }
      },
      auth: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        researchAge: [18, 30],
        relationKinds: ['forLove', 'forSex', 'forFriends'],
        roleOptions: ['lover', 'god'],
        genderOptions: [
          {
            label: 'Homme',
            value: 'male'
          },
          {
            label: 'Femme',
            value: 'female'
          }
        ],
        authInfos: {
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
        if (this.isEdit) {
          return (this.user[this.primaryKey]) ? this.user[this.primaryKey] : this.$route.params.id
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
      editAction () {
        if (this.isEdit) {
          return 'edit'
        } else {
          return 'create'
        }
      },
      interactions () {
        return this.$store.getters[this.database + '/interactions/query']()
          .where('from_user_id', this.getUid)
          .orWhere('to_user_id', this.getUid)
          .get()
      },
      messages () {
        return this.interactions.filter(v => v.type === 'message').length
      },
      challenges () {
        return this.interactions.filter(v => v.type === 'challenge').length
      },
      interactionsProportion () {
        let percentage = {}
        let total = this.messages + this.challenges
        percentage.messages = Math.floor(this.messages * 100 / total)
        percentage.challenges = Math.floor(this.challenges * 100 / total)
        return percentage
      },
      researchAgeObject () {
        let researchAgeObject = {}
        researchAgeObject.min = this.researchAge[0]
        researchAgeObject.max = this.researchAge[1]
        return researchAgeObject
      }
    },
    watch: {
      user () {
        this.updateNewChange()
      }
    },
    methods: {
      ...mapActions(['adminEditUser', 'adminCreateAuth']),
      updateNewChange () {
        this.newChange = cloneDeep(this.user)
        this.authInfos = cloneDeep(this.auth)
        if (this.isEdit) {
          this.researchAge = [
            this.newChange.researchAge.min,
            this.newChange.researchAge.max
          ]
        }
      },
      editResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'L\'utilisateur "' + this.newChange.displayName + '", a bien été ajouté'
        })
      },
      addResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'L\'utilisateur "' + this.newChange.displayName + '", a bien été modifié'
        })
      },
      create () {
        let that = this
        this.newChange.researchAge = this.researchAgeObject
        this.adminCreateAuth({
          authData: this.authInfos,
          userData: this.newChange,
          verbose: this.debug
        }).then(() => {
          that.addResponse()
        }).catch(function (e) {
          console.error(e)
          that.$notify.error({
            title: 'Erreur',
            message: 'Une erreur lors de la création de l\'utilisateur'
          })
        })
      },
      edit () {
        let that = this
        this.newChange.researchAge.min = this.researchAge[0]
        this.newChange.researchAge.max = this.researchAge[1]
        this.adminEditUser({
          id: this.getUid,
          toSave: this.newChange,
          verbose: this.debug,
          authData: this.authInfos
        }).then(() => {
          that.editResponse()
        }).catch(function (e) {
          console.error(e)
          that.$notify.error({
            title: 'Erreur',
            message: 'Une erreur lors de la modification de l\'utilisateur'
          })
        })
      }
    }
  }
</script>
