<template>
    <div>
      <h1 class="main-title"><span class="icomoon">&#xe9ba</span> Centre d'intéret</h1>
      <el-row :gutter="20">
        <el-col>
        </el-col>
      </el-row>
        <div>
            <VueFormGenerator v-if="isLoaded > 0" :schema="addInteret.schema" :model="addInteret.model">
            </VueFormGenerator>
        </div>
        <div>
            <h2>Liste des centres d'intéret</h2>
            <helperTables :data="adminInterets" :columns="interetsList.columns">
              <span slot="parents" slot-scope="categorie">
                  <span class="icomoon"></span>{{categorie}}
              </span>
              <span slot="actions" slot-scope="categorie">
                  <a @click.prevent="deleteFirestoreAdminInteret(categorie.item.id)" class="icomoon icone_btn">
                    &#xe9ad
                  </a>
                      <!--<router-link :to="{name:'deleteFirestoreAdminInteret', params: {id: categorie.item.id}}" class="icomoon icone_btn">-->
                      <!--l-->
                      <!--</router-link>-->
              </span>
            </helperTables>
        </div>
    </div>

</template>

<script>
  import { mapActions } from 'vuex'
  // import { db } from '@/config/firebaseLovelCloud'
  import Vue from 'vue'

  import helperTables from '@/Modules/Elements/Templates/helperTables'
  import { addInteretSchema } from '../Services/InteretSchema'

  import VueFormGenerator from 'vue-form-generator'

  Vue.use(VueFormGenerator)

  export default {
    name: 'adminInteretsIndex',
    data () {
      let data = {
        defaultModel: {
          name: ''
        },
        isLoaded: false,
        addInteret: {
          schema: {
            fields: addInteretSchema(this.InteretsList)
          },
          model: {
            name: ''
          }
        },
        interetsList: {
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
              title: 'parent',
              name: 'parents',
              type: 'slot'
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
      ...mapActions(['getFirestoreAdminInterests', 'deleteFirestoreAdminInterest', 'addFirestoreAdminInterest']),
      addSelectValue (model, values, key = 'values') {
        // console.log(model)
        // console.log(this.addInteret)
        // console.log(values)
        this.addInteret.schema.fields.map((v) => {
          if (v.model === model) {
            v[key] = values
          }
          return v
        })
      },
      loadData () {
        let that = this
        this.getFirestoreAdminInterests()
        .then(() => {
          that.addSelectValue('parent_id', this.InteretsList)
          that.addInteret.schema.fields.push({
            buttonText: 'ajouter',
            onSubmit: this.addInteretSubmit,
            type: 'submit'
          })
          that.isLoaded = true
        })
      },
      addInteretSubmit () {
        this.addFirestoreAdminInterest(this.addInteret.model)
        this.addInteret.model = {}
      }
    },
    computed: {
      InteretsList () {
        return this.adminInterets ? this.adminInterets.map((v) => {
          return {id: v.id, name: v.name}
        }) : {}
      },
      adminInterets () {
        return this.$store.getters['entities/interets/query']()
          .with('parents')
          .get()
      },
      countInterets () {
        return this.adminInterets.length
      }
    },
    created () {
      this.loadData()
    },
    watch: {
      InteretsList (data) {
        this.addSelectValue('parent_id', data)
      }
    },
    components: {
      helperTables
    }
  }
</script>
