<template>
  <div>
    <!--<h2 class="title">Liste des centres d'intéret</h2>-->
    <slot name="top"/>
    <el-table
      :data="interests"
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
        <span slot-scope="scope">
          <span v-if="scope.row.parent && scope.row.parent_id">
            {{scope.row.parent.name}}
          </span>
        </span>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Opérations"
      >
        <span slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" circle @click="$router.push({name:'adminInteretEdit', params: {id: scope.row.id}})">
          </el-button>
          <el-button icon="el-icon-delete" type="danger" circle @click="deleteInteret(scope.row)">
          </el-button>
        </span>
      </el-table-column>
    </el-table>
    <!--<helperTables :data="adminInterets" :columns="interetsListOption.columns">-->
          <!--<span slot="name" slot-scope="interet">-->
          <!--</span>-->

          <!--<span slot="parent" slot-scope="categorie">-->
              <!--<span class="icomoon"></span>-->
              <!--<span v-if="categorie.item.parent_id">-->
                  <!--{{categorie.item.parent.name}}-->
              <!--</span>-->
          <!--</span>-->

          <!--<span slot="childrens" slot-scope="categorie">-->
              <!--<span class="icomoon"></span>-->
              <!--<ul v-if="categorie.item.childrens">-->
                  <!--<li v-for="children in categorie.item.childrens">-->
                      <!--{{children.name}}-->
                  <!--</li>-->
              <!--</ul>-->
          <!--</span>-->

          <!--<span slot="actions" slot-scope="categorie">-->
              <!--<a @click.prevent="deleteFirestoreAdminInteret(categorie.item.id)" class="icomoon icone_btn">-->
                <!--&#xe9ad-->
              <!--</a>-->
              <!--<router-link-->
                      <!--:to="{name:'adminInteretEdit', params: {id: categorie.item.id}}"-->
                      <!--class="icomoon icone_btn"-->
              <!--&gt;-->
                <!--&#xe906-->
              <!--</router-link>-->
          <!--</span>-->
      <!--</helperTables>-->
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  import helperTables from '@/Modules/Elements/Templates/helperTables'

  export default {
    name: 'admin-Interets-list',
    props: {
      isLoading: {
        type: Boolean,
        default: false
      },
      interests: {
        default () {
          return []
        }
      }
    },
    data () {
      let data = {
        // isLoaded: false,
        interetsListOption: {
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
              title: 'Centre d\'interet parent',
              name: 'parent',
              type: 'slot',
              order: true
            },
            {
              title: 'Centres d\'interets enfant',
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
      ...mapActions(['adminRemoveInterest']),
      log (...args) {
        console.log(...args)
      },
      isEmpty () {
        return this.interests.length > 0
      },
      deleteInteret (interet) {
        let that = this
        this.$confirm(
          'Etes vous sûr de vouloir supprimer ' + interet.name + ' des centres d\'intéret de l\'application ?',
          'Confirmer la suppression', {
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler'
          })
          .then(() => {
            this.adminRemoveInterest({
              id: interet.id,
              verbose: this.debug
            })
              .then(() => {
                that.$notify({
                  title: 'Succès',
                  type: 'success',
                  message: interet.name + ' à bien été supprimé de l\'application'
                })
              })
              .catch(() => {
                that.$notify({
                  title: 'Erreur de suppression',
                  message: 'Un problème est survenu lors de la suppression du centre d\'intérêt ' + interet.name,
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
      InteretsList () {
        return this.interests ? this.interests.map((v) => {
          return {id: v.id, name: v.name}
        }) : {}
      },
      adminInterets () {
        return this.$store.getters['entities/interests/query']()
          .with('childrens')
          .with('parent').get()
      },
      countInterets () {
        return this.interests.length
      }
    },
    created () {
      // this.loadData()
    },
    watch: {
    },
    components: {
      helperTables
    }
  }
</script>
