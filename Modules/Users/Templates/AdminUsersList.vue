<template>
  <div>
    <slot name="top"/>
    <el-table
      :data="users"
      v-loading="isLoading"
      empty-text="Aucun centre d'intéret n'a été trouvé !"
    >
      <el-table-column
        prop="id"
        label="ID"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="Nom"
        sortable
      ></el-table-column>
      <el-table-column
        label="Parent"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Opérations"
      >
        <span slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" circle @click="$router.push({name:'adminUserEdit', params: {id: scope.row.id}})">
          </el-button>
          <el-button icon="el-icon-delete" type="danger" circle @click="deleteUser(scope.row)">
          </el-button>
        </span>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  import helperTables from '@/Modules/Elements/Templates/helperTables'

  export default {
    name: 'admin-Users-list',
    props: {
      isLoading: {
        type: Boolean,
        default: false
      },
      users: {
        default () {
          return []
        }
      }
    },
    data () {
      let data = {
        usersListOption: {
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
              title: 'Centre d\'user parent',
              name: 'parent',
              type: 'slot',
              order: true
            },
            {
              title: 'Centres d\'users enfant',
              name: 'childrens',
              type: 'slot',
              order: true
            },
            {
              title: 'Actions',
              name: 'actions',
              type: 'slot'
            }
          ]
        }
      }
      return data
    },
    methods: {
      ...mapActions(['adminRemoveUser']),
      log (...args) {
        console.log(...args)
      },
      isEmpty () {
        return this.users.length > 0
      },
      deleteUser (user) {
        let that = this
        this.$confirm(
          'Etes vous sûr de vouloir supprimer ' + user.name + ' des centres d\'intéret de l\'application ?',
          'Confirmer la suppression', {
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler'
          })
          .then(() => {
            this.adminRemoveUser({
              id: user.id,
              verbose: this.debug
            })
              .then(() => {
                that.$notify({
                  title: 'Succès',
                  type: 'success',
                  message: user.name + ' à bien été supprimé de l\'application'
                })
              })
              .catch(() => {
                that.$notify({
                  title: 'Erreur de suppression',
                  message: 'Un problème est survenu lors de la suppression du centre d\'intérêt ' + user.name,
                  type: 'error'
                })
              })
          })
      }
    },
    computed: {
      debug () {
        return this.$store.getters.debug
      },
      UsersList () {
        return this.users ? this.users.map((v) => {
          return {id: v.id, name: v.name}
        }) : {}
      },
      countUsers () {
        return this.users.length
      }
    },
    watch: {
    },
    components: {
      helperTables
    }
  }
</script>
