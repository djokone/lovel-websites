<template>
  <div>
    <el-form class="form"
             :model="newChange"
             label-position="right"
             label-width="200px"
             v-if="media">
      <el-form-item label="Référence">
        <el-select v-model="newChange.ref" placeholder="selectionnez une référence"
            @change="clearRefId">
          <el-option
            v-for="item in refOptions"
            :key="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="newChange.ref=='users'" label="Pseudo utilisateur référence">
        <el-select
          v-model="newChange.ref_id"
          filterable
          remote
          reserve-keyword
          placeholder="entrez un mot-clé"
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
      <div v-if="newChange.ref=='interactions'">
        <el-form-item label="Match">
          <el-select
            v-model="match.from_user_id"
            filterable
            remote
            reserve-keyword
            placeholder="utilisateur 1"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="clearRefId">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select
            v-model="match.to_user_id"
            filterable
            remote
            reserve-keyword
            placeholder="utilisateur 2"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="revertMatch" type="primary">Inverser</el-button>
        </el-form-item>
        <el-form-item label="Id référence">
          <el-select
            v-model="newChange.ref_id"
            placeholder="selectionnez un Id">
            <el-option
              v-for="item in interactionsMatch"
              :key="item.id"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="URL">
        <el-input v-model="newChange.storage_uri"></el-input>
      </el-form-item>
      <el-form-item label="Image">
        <el-image
          :src="newChange.storage_uri"
          fit="contain">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </el-form-item>
      <el-form-item>
        <el-button style="float: right" type="success" @click="edit">Enregistrer</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import { mapActions } from 'vuex'

  export default {
    name: 'adminMediasEdit',
    props: {
      media: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    created () {
      this.updateNewChange()
    },
    data () {
      return {
        match: {
          from_user_id: '',
          to_user_id: ''
        },
        options: this.usersArray,
        refOptions: ['interactions', 'users'],
        loading: false,
        newChange: {
        }
      }
    },
    watch: {
      user () {
        this.updateNewChange()
      }
    },
    computed: {
      list () {
        return this.usersArray.map(item => {
          return { value: item.id, label: item.displayName }
        })
      },
      database () {
        return this.$store.getters.currentDatabaseId
      },
      usersArray () {
        return this.$store.getters[this.database + '/users/query']().get()
      },
      interactionsArray () {
        return this.$store.getters[this.database + '/interactions/query']()
          .with('media')
          .get()
      },
      interactionsWithMedias () {
        return this.interactionsArray.filter(item => {
          return item.media !== undefined
        })
      },
      interactionsMatch () {
        return this.$store.getters[this.database + '/matchs/query']()
          .where('from_user_id', this.match.from_user_id)
          .where('to_user_id', this.match.to_user_id)
          .get()
      }
    },
    methods: {
      ...mapActions(['adminEditMedia']),
      updateNewChange () {
        this.newChange = cloneDeep(this.media)
      },
      clearRefId () {
        this.newChange.ref_id = ''
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
      revertMatch () {
        let sto = this.match.from_user_id
        this.match.from_user_id = this.match.to_user_id
        this.match.to_user_id = sto
      },
      editResponse () {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le media "' + this.newChange.id + '", a bien été ajouté'
        })
      },
      edit () {
        let that = this
        this.newChange.researchAge = this.researchAgeFormatted
        this.adminEditMedia({
          id: this.media.id,
          toSave: this.newChange,
          verbose: this.debug
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