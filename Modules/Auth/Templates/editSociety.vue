<template>
  <div id="edit__socity">
    <h2>Information de votre entreprise</h2>
    <my-form
      :inputs="inputs"
      :datas='data.company'
      @output="change"
      :errors="getErrors()"
      >
    </my-form>
  </div>

</template>
<script>
  import myForm from '@/Modules/Elements/Templates/myForm'
  import { isEmpty } from 'lodash'

  export default ({
    props: {
      data: {
        type: [Object, Array]
      },
      errors: {
        type: [Array, Object]
      }
    },
    data () {
      return {
        inputs: [
          {
            name: 'name',
            label: 'Nom de société :',
            placeholder: 'John & co'
          },
          {
            name: 'activity',
            label: 'Activité de l\'entreprise',
            placeholder: 'Vente de matériel de cuisine'
          },
          {
            name: 'siret',
            label: 'N° de siret',
            placeholder: '732 829 320 00074'
          },
          {
            name: 'siege',
            form: [
              {
                name: 'adresse',
                type: 'textarea',
                label: 'Votre adresse',
                placeholder: '1 rue de la fontaine'
              },
              {
                name: 'ville',
                label: 'Votre ville',
                placeholder: 'Serris'
              },
              {
                name: 'postal',
                label: 'Votre code postal',
                placeholder: '77700'
              },
              {
                name: 'fix',
                label: 'Numero de telephone',
                placeholder: '06 48 58 77 96'
              }
            ]
          }
        ]
      }
    },
    methods: {
      change (value) {
        this.data.company = value
        // this.data.company = value
        // this.$emit('onChange', value)
      },
      getErrors () {
        if (!isEmpty(this.errors)) {
          if (!isEmpty(this.errors.company)) {
            return this.errors.company
          }
        }
        return false
      }
    },
    components: {
      myForm
    }
  })
</script>
