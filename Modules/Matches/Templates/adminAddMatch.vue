<template>
  <div>
    <el-form class="form"
      :model="newMatch"
      label-position="right"
      label-width="200px">
      <el-form-item label="Utilisateur">
        <el-select
          v-model="newMatch.to_user_id"
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
      <el-form-item label="Niveau">
        <el-input-number v-model="newMatch.level" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button style="float: right" type="primary" @click="add">Enregistrer le match</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'
  import { mapActions } from 'vuex'

  export default {
    name: 'adminAddMatch',
    mixins: [LoadCurrentDatabase],
    load: {
      actions: ['adminLoadUsers']
    },
    props: {
      id: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        options: this.usersArray,
        loading: false,
        newMatch: {
          from_user_id: this.id,
          to_user_id: '',
          level: 0,
          state: 'start'
        }
      }
    },
    mounted () {
      this.list = this.usersArray.map(item => {
        return { value: item.id, label: item.displayName }
      })
    },
    computed: {
      usersArray () {
        return this.$store.getters[this.database + '/users/query']().get()
      }
    },
    methods: {
      ...mapActions(['adminAddMatch']),
      add () {
        this.adminAddMatch({
          data: this.newMatch
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
