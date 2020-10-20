<template>
	<div>
    <el-table
      :data="challenges"
      v-loading="isLoading"
      empty-text="Aucun centre challenge n'a été trouvé !"
      max-height="625"
      ref="multitable"
      @selection-change="onSelectionChange"
    >
      <el-table-column v-if="isSelectionMode" type="selection" width="55">
      </el-table-column>
      <el-table-column
        type="expand"
      >
        <template slot-scope="props">
          <el-row :gutter="20">
            <el-col :span="12">
              <p style="text-align: left;">
                Règle du défi : <br>
                {{props.row.description}}
              </p>
            </el-col>
            <el-col :span="12" v-if="props.row.interests.length > 0">
              <p  style="text-align: left;">
                Centres d'intérets : <br>
              </p>
              <p style="text-align: left;">
                <el-tag v-for="(interest, index) in props.row.interests" :key="index">
                  {{interest.name}}
                </el-tag>

              </p>
            </el-col>
          </el-row>

        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="Titre"
      >
      </el-table-column>
      <el-table-column label="Type de jeu">
        <span slot-scope="scope">
          <span v-if="scope.row.game">
            {{scope.row.game.name}}
          </span>
        </span>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Opérations"
      >
        <span slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" circle @click="$router.push({name:'adminChallengeEdit', params: {id: scope.row.id}})">
          </el-button>
          <el-button icon="el-icon-delete" type="danger" circle @click="remove(scope.row)">
          </el-button>
        </span>
      </el-table-column>
    </el-table>
		<!--<HelperTables-->
      <!--:data="challenges"-->
      <!--:columns="challengesListOptions.columns"-->
    <!--&gt;-->
      <!--<span slot="actions" slot-scope="challenge">-->
        <!--<a @click.prevent="deleteFirestoreAdminChallenge(challenge.item.id)" class="icomoon icone_btn">-->
            <!--&#xe9ad-->
        <!--</a>-->
        <!--<router-link-->
          <!--:to="{name:'adminChallengeEdit', params: {id: challenge.item.id}}"-->
          <!--class="icomoon icone_btn"-->
        <!--&gt;-->
          <!--&#xe906-->
        <!--</router-link>-->
      <!--</span>-->
		<!--</HelperTables>-->
	</div>
</template>

<script>
  // import HelperTables from '/modules/Elements/Templates/helperTables'
  import SelectableList from '@/Modules/DatabasesManager/Mixins/SelectableList'
  import { mapActions } from 'vuex'
  export default {
    mixins: [SelectableList],
    selectable: {
      ref: 'multitable',
      resultKey: 'challenges'
    },
    components: {
      // HelperTables
    },
    name: 'admin-challenges-list',
    data () {
      return {
        currentSelection: [],
        allSelection: [],
        challengesListOptions: {
          columns: [
            {
              title: 'ID',
              name: 'id'
            },
            {
              title: 'Nom',
              name: 'name'
            },
            {
              title: 'Actions',
              name: 'actions',
              type: 'slot'
            }
          ]
        }
      }
    },
    props: {
      isLoading: {
        type: Boolean,
        default: false
      },
      // isSelectionMode: {
      //   type: Boolean,
      //   default: false
      // },
      challenges: {
        type: Array,
        default () {
          return []
        }
      },
      interests: {
        type: Array,
        default () {
          return []
        }
      }
    },
    computed: {
      debug () {
        return this.$store.getters.debug
      },
      isLoaded () {
        return this.challenges.length > 0
      }
      // multitable () {
      //   return this.$refs.multitable
      // },
      // newCurrentSelection () {
      //   return this.challenges.filter(f => {
      //     return this.allSelection.find(r => {
      //       return r.id === f.id
      //     })
      //   })
        // return newCurrentSelection.forEach(v => {
        //   console.log(v)
        //   this.$refs.multitable.toggleRowSelection(v, true)
        // })
      // }
    },
    watch: {
      // newCurrentSelection (val) {
      //   val.forEach(v => {
      //     this.$refs.multitable.toggleRowSelection(v, true)
      //   })
      // }
    },
    methods: {
      ...mapActions(['adminRemoveChallenges']),
      removeSuccessResponse (challenge) {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le défi "' + challenge.name + '", a bien été supprimé'
        })
      },
      // async onSelectionChange (val) {
      //   let isRemove = this.currentSelection.length > val.length
      //   this.currentSelection = val
      //   if (this.allSelection.length && !isRemove) {
      //     this.mergeInAllSelection(val)
      //   } else if (isRemove) {
      //     this.allSelection = this.allSelection.filter(v => {
      //       return val.find(f => {
      //         return f.id === v.id
      //       })
      //     })
      //   } else {
      //     this.allSelection = val
      //   }
      //   this.$emit('changeSelection', this.allSelection)
      // },
      // mergeInAllSelection (val) {
      //   let newSelection = val.filter(v => {
      //     return !this.allSelection.find(r => {
      //       return v.id === r.id
      //     })
      //   })
      //   this.allSelection = [...this.allSelection, ...newSelection]
      // },
      remove (challenge) {
        let that = this
        this.adminRemoveChallenges({
          id: challenge.id,
          verbose: that.debug
        })
          .then(() => {
            that.removeSuccessResponse(challenge)
          })
          .catch((e) => {
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
