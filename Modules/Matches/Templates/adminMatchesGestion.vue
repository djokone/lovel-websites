<template>
  <div>
    <el-row v-if="addMatch">
      <el-col>
        <el-card>
          <div slot="header" class= "clearfix">
            <span class="small-title admin-header">Ajouter un Match</span>
            <i style="float: right;" class="el-icon-close admin-link" @click="toogleAddMatch"></i>
          </div>
          <adminAddMatch :id="uid"/>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="editMatch">
      <el-col>
        <el-card>
          <div slot="header" class= "clearfix">
            <span class="small-title admin-header">Editer un match</span>
            <i style="float: right;" class="el-icon-close admin-link" @click="toogleEditMatch"></i>
          </div>
          <adminMatchEdit :match="setMatch"/>
        </el-card>
      </el-col>
    </el-row>
    <h3>Liste des matchs de cet utilisateur
      <el-button type="success" style="margin-bottom: 20px; float: right" @click="toogleAddMatch">Ajouter un match</el-button>
    </h3>
    <el-table
      :data="formatedMatchesArray"
      height="394"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="Id"
        width="200">
      </el-table-column>
      <el-table-column
        prop="userDisplayName"
        label="Utilisateur"
        width="120">
      </el-table-column>
      <el-table-column
        prop="level"
        label="Niveau"
        width="100">
      </el-table-column>
      <el-table-column
        prop="state"
        label="Etat"
        width="50">
      </el-table-column>
      <el-table-column
        fixed="right">
        <span slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            :circle="true"
            type="primary"
            @click="toogleEditMatch(scope.row)"
          ></el-button>
          <el-button
            icon="el-icon-delete"
            :circle="true"
            type="danger"
            @click="deleteMatch(scope.row)"
          ></el-button>
        </span>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'
  import { mapActions } from 'vuex'
  import adminAddMatch from '@/Modules/Matches/Templates/adminAddMatch'
  import adminMatchEdit from '@/Modules/Matches/Templates/adminMatchEdit'

  export default {
    name: 'adminMatchesGestion',
    props: {
      user: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    mixins: [LoadCurrentDatabase],
    components: {
      adminAddMatch,
      adminMatchEdit
    },
    load: {
      actions: []
    },
    data () {
      return {
        addMatch: false,
        editMatch: false
      }
    },
    computed: {
      uid () {
        return this.user.id
      },
      matchesArray () {
        return this.$store.getters[this.database + '/matchs/query']()
          .where('from_user_id', this.user.id)
          .orWhere('to_user_id', this.user.id)
          .with('messages.media')
          .get()
      },
      usersArray () {
        return this.$store.getters[this.database + '/users/query']().get()
      },
      foreignUsersIds () {
        let foreignIds = []
        for (let i = 0; i !== this.matchesArray.length; i++) {
          if (this.matchesArray[i].from_user_id === this.user.id && this.matchesArray[i].to_user_id !== this.user.id) {
            foreignIds.push(this.matchesArray[i].to_user_id)
          } else if (this.matchesArray[i].to_user_id === this.user.id) {
            foreignIds.push(this.matchesArray[i].from_user_id)
          }
        }
        return foreignIds
      },
      foreignUsersArray () {
        let usersArray = []
        for (let i = 0; i !== this.foreignUsersIds.length; i++) {
          for (let j = 0; j !== this.usersArray.length; j++) {
            if (this.foreignUsersIds[i] === this.usersArray[j].id) {
              usersArray.push(this.usersArray[j].displayName)
            }
          }
        }
        return usersArray
      },
      formatedMatchesArray () {
        let formatedArray = []
        for (let i = 0; i !== this.foreignUsersArray.length; i++) {
          formatedArray.push({
            level: this.matchesArray[i].level,
            state: this.matchesArray[i].state,
            userDisplayName: this.foreignUsersArray[i],
            id: this.matchesArray[i].id
          })
        }
        return formatedArray
      },
      setMatch () {
        let match
        if (this.editMatch) {
          this.matchesArray.forEach(element => {
            (element.id === this.editMatch) ? match = element : match
          })
          return match
        }
        return false
      }
    },
    methods: {
      ...mapActions(['adminDeleteMatch', 'adminLoadMatches']),
      deleteMatch (row) {
        this.adminDeleteMatch({
          id: row.id
        })
      },
      toogleAddMatch () {
        this.addMatch = !this.addMatch
      },
      toogleEditMatch (row) {
        if (this.editMatch) {
          this.editMatch = false
        } else {
          this.editMatch = row.id
        }
      }
    }
  }
</script>
