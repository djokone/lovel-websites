<template>
    <div class="addInterets">
      <h2 class="title">Ajouter un centre d'intéret</h2>
      <el-form ref="addInteretForm" :model="addInteret.model" :label-position="'top'" :inline="true" label-width="100px">
        <el-form-item label="Nom" prop="name">
          <el-input v-model="addInteret.model.name"></el-input>
        </el-form-item>
        <el-form-item label="Parent">
          <el-cascader v-model="addInteret.model.parent_id" :options="InteretsList" :clearable="true" placeholder="Selectionner un parent"></el-cascader>
        </el-form-item>
        <el-row>
          <el-form-item>
            <el-button type="success" @click="addInteretFirestore">Ajouter</el-button>
            <el-button type="danger" @click="resetForm('addInteretForm')">Reset</el-button>
          </el-form-item>
        </el-row>
      </el-form>
        <!--<VueFormGenerator :schema="addInteret.schema" :model="addInteret.model">-->
        <!--</VueFormGenerator>-->
    </div>
</template>

<script>
  import { mapActions } from 'vuex'

  // import { addInteretSchema } from '../Services/InteretSchema'

  export default {
    name: 'admin-add-interets',
    data () {
      return {
        defaultModel: {
          name: ''
        },
        addInteret: {
          schema: {
            fields: [
              {
                type: 'input',
                label: 'Nom du centre d\'interet',
                model: 'name',
                min: 6,
                inputType: 'text'
              },
              {
                type: 'select',
                label: 'interet',
                model: 'parent_id',
                values: []
              },
              {
                buttonText: 'ajouter',
                onSubmit: this.addInteretSubmit,
                type: 'submit'
              }
            ]
          },
          model: {
            name: ''
          }
        }
      }
    },
    props: {
      isLoaded: {
        default: false,
        type: [Boolean, Promise]
      }
    },
    created () {
      this.addSelectValue('parent_id', this.InteretsList)
      this.addInteret.schema.fields.push()
    },
    computed: {
      formRef () {
        return this.$refs.addInteretForm.resetFields
      },
      InteretsList () {
        return this.adminInterets ? this.adminInterets.map((v) => {
          return {value: v.id, label: v.name}
        }) : {}
      },
      adminInterets () {
        return this.$store.getters['entities/interets/query']().with('parents').get()
      }
    },
    methods: {
      ...mapActions(['addFirestoreAdminInteret']),
      resetForm (formRef) {
        console.log(formRef)
        this.$refs[formRef].resetFields()
      },
      loadData () {
        let that = this
        // console.log('load')
        this.getFirestoreAdminInterets()
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
      addSelectValue (model, values, key = 'values') {
        this.addInteret.schema.fields.map((v) => {
          if (v.model === model) {
            v[key] = values
          }
          return v
        })
      },
      addInteretFirestore () {
        let that = this
        this.addFirestoreAdminInteret(this.addInteret.model)
          .then(function () {
            that.addInteret.model = {}
            that.$notify({
              title: 'Succès',
              type: 'success',
              message: 'Votre centre d\'intéret à bien été ajouté'
            })
          })
          .catch(function (e) {
            console.error(e)
            that.$notify.error({
              title: 'Erreur',
              message: 'Une erreur c\'est produit lors de l\'ajout '
            })
          })
      }
    },
    watch: {
      InteretsList (data) {
        this.addSelectValue('parent_id', data)
      }
    }
  }
</script>

<style scoped>

</style>
