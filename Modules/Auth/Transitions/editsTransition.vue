<style lang="scss">
  h1::first-letter{
    text-transform: uppercase;
  }
  #editAll{
    position: relative;
  }
  .updatedloaded{
    z-index: 15;
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    top:0px; bottom:0px; left:0px; right:0px;
    h3.loader{
      color: #e3001b;
      text-align: center;
    }
  }
</style>

<template>
<div id="editAll" v-if="isLoaded">
<div class="updatedloaded" v-if="isUpdated">
  <loader></loader>
  <h3 class="loader">Mise à jour des informations ...</h3>
</div>
  <h1>édition du compte</h1>

  <edit-photo
    :data="user"
  ></edit-photo>
  <edit-user
    :data='userUpdate'
    :errors="errors.user"
  ></edit-user>
  <edit-profil
    :data="userUpdate"
    :errors="errors"
    :new="isNew(userUpdate.profil)"
  ></edit-profil>
  <edit-society
    :data="userUpdate"
    :errors="errors"
     ></edit-society>
 <!--  <edit-website :data="user.website" ></edit-website> -->
  <a @click="send" class="submit">Valider et continuer ...</a>
</div>
</template>

<script>
  import editPhoto from '../Templates/editPhoto'
  import editProfil from '../Templates/editProfil'
  import editSociety from '../Templates/editSociety'
  import editWebsite from '../Templates/editWebsite'
  import editUser from '../Templates/editUser'
  import loader from '@/Modules/Loader/Templates/loader'
  import { mapActions, mapGetters } from 'vuex'
  import { cloneDeep, isEmpty } from 'lodash'

  export default ({
    name: 'EditsTransition',
    data () {
      return {
        isUpdated: false,
        userUpdate: {
        },
        ok: false
      }
    },
    mounted () {
      this.userUpdate = cloneDeep(this.user)
      // if (this.userUpdate.profil === 'undefined') {}
      this.ok = true
    },
    methods: {
      ...mapActions({
        saveProfil: 'saveProfil',
        setFlash: 'setFlash'
      }),
      changeProfil (val) {
        this.userUpdate.profil = val
      },
      send () {
        window.scrollTo(0, 0)
        this.isUpdated = true
        this.saveProfil({data: this.userUpdate, id: this.user.id}).then((response) => {
          this.isUpdated = false
          if (response.success) {
            this.setFlash({message: 'Vos information on bien été mis a jour !'})
            // window.location.reload()
          } else {
            console.log(response)
            this.setFlash({
              message: 'Une erreurs c\'est glissé ...',
              type: 'error'
            })
            // console.log('isError')
            // this.errors = response.data.errors
          }
        })
      },
      isNew (item) {
        return typeof item === 'undefined'
      }
    },
    computed: {
      ...mapGetters({
        user: 'user',
        isLoaded: 'isAuthLoaded',
        errors: 'errors'
      }),
      dataIsLoaded () {
        return !isEmpty(this.userUpdate)
      }
    },
    watch: {
      user: {
        handler (val, oldVal) {
          this.userUpdate = cloneDeep(val)
          this.ok = true
          // if (!this.userUpdate.company.siege) {
          //   this.userUpdate.company.siege = {
          //     adresse: '',
          //     ville: '',
          //     postal: '',
          //     fix: ''
          //   }
          // }
        }
        // deep: true
      }
    },
    components: {
      editProfil,
      editPhoto,
      editSociety,
      editWebsite,
      editUser,
      loader
    }
  })
</script>
