<template>
	<div>
    <el-table
      :data="Games"
      v-loading="!isLoaded"
      empty-text="Aucun centre Game n'a été trouvé !"
    >
      <el-table-column
        type="expand"
      >
        <template slot-scope="props">
          <p style="text-align: left;">
            Règle du défi : <br>
            {{props.row.description}}
          </p>
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
      <el-table-column label="Catégorie">
        <span slot-scope="scope"></span>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Opérations"
      >
        <span slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" circle @click="$router.push({name:'adminChallengeGameEditTab', params: {id: scope.row.id}})">
          </el-button>
          <el-button icon="el-icon-delete" type="danger" circle @click="remove(scope.row)">
          </el-button>
        </span>
      </el-table-column>
    </el-table>
		<!--<HelperTables-->
      <!--:data="Games"-->
      <!--:columns="GamesListOptions.columns"-->
    <!--&gt;-->
      <!--<span slot="actions" slot-scope="Game">-->
        <!--<a @click.prevent="deleteFirestoreAdminGame(Game.item.id)" class="icomoon icone_btn">-->
            <!--&#xe9ad-->
        <!--</a>-->
        <!--<router-link-->
          <!--:to="{name:'adminGameEdit', params: {id: Game.item.id}}"-->
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
  import { mapActions } from 'vuex'
  export default {
    components: {
      // HelperTables
    },
    name: 'admin-Games-list',
    data () {
      return {
        GamesListOptions: {
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
      Games: {
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
      isLoaded () {
        return this.Games.length > 0
      }
    },
    methods: {
      ...mapActions(['adminDeleteGame']),
      removeSuccessResponse (Game) {
        this.$notify({
          title: 'Succès',
          type: 'success',
          message: 'Le défi "' + Game.name + '", a bien été supprimé'
        })
      },
      remove (Game) {
        let that = this
        this.adminDeleteGame({
          id: Game.id,
          deleteChallenges: true
        })
          .then(() => {
            that.removeSuccessResponse(Game)
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
