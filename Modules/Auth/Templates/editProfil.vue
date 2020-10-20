<template>
  <div class="form">
    <h2>Vos information de profil</h2>
      <my-form
        :inputs="inputs"
        :datas="data.profil"
        @output="changeProfil"
        :errors="getErrors">
      </my-form>
  </div>
</template>

<script>
  import myInput from '@/Modules/Elements/Templates/input'
  import { isEmpty } from 'lodash'
  import myForm from '@/Modules/Elements/Templates/myForm'

  export default ({
    props: {
      data: {
        type: [Array, Object]
      },
      errors: {
        type: [Array, Object]
      },
      isNew: {
        type: [Boolean]
      }
    },
    data () {
      return {
        forms: {
          profil: {}
        },
        inputs: [
          {
            label: 'Votre nom :',
            name: 'nom',
            placeholder: 'Doe'
          },
          {
            label: 'Votre prénom :',
            name: 'prenom',
            placeholder: 'John'
          },
          {
            label: 'Votre poste :',
            name: 'poste',
            placeholder: 'Assistant commercial'
          },
          {
            label: 'Téléphone professionnel :',
            name: 'tel',
            placeholder: '06 87 98 58 26'
          },
          {
            label: 'Votre site web :',
            name: 'website',
            placeholder: 'www.imperialinternational.eu'
          }
        ]
      }
    },
    computed: {
      getErrors () {
        if (!isEmpty(this.errors)) {
          if (!isEmpty(this.errors.profil)) {
            return this.errors.profil
          }
        }
        return false
      }
    },
    methods: {
      changeProfil (value) {
        this.data.profil = value
      },
      getProfilErrors (field) {
        if (!isEmpty(this.errors.profil)) {
          if (typeof this.errors.profil[field] === 'undefined') {
            return false
          } else {
            return this.errors.profil[field]
          }
        } else {
          return false
        }
      }
    },
    components: {
      myInput,
      myForm
    }
  })
</script>
