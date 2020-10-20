<style lang="scss" src="../Scss/sidbar.scss">
</style>

<template>
  <div id="sidbar">
    <div class="responsive_big">
      <auth-dispatch :conditions="authorisation.profil">
        <profil>
        </profil>
      </auth-dispatch>
      <categories></categories>
      <marques></marques>

    </div>

    <div class="responsive_small">

    </div>
    <!-- <div class="responsive_small" :class="state">

      <div class="contain"> -->
        <!-- <scrollbar> -->
          <!-- <auth-dispatch :conditions="authorisation.profil">
            <profil>
            </profil>
          </auth-dispatch>
          <categories></categories>
          <marques></marques> -->
        <!-- </scrollbar> -->

     <!--  </div>
      <img
        src="../../../assets/btn-sidbar.jpg"
        @click="toggle()"
        alt=""
        class="burgerMenu"
      > -->

    <!-- </div> -->
  </div>
</template>

<script>
  import scrollbar from '@/Modules/Scrollbar/Templates/scrollbar-malihu'
  import profil from './profil'
  import categories from './categories'
  import marques from './marques'
  import authDispatch from '@/Modules/Auth/Elements/authDispatch'
  import { mapActions } from 'vuex'

  export default ({
    data () {
      return {
        open: false,
        authorisation: {
          profil: ['admin', 'rev']
        }
      }
    },
    methods: {
      ...mapActions({
        changeEtat: 'changeEtat'
      }),
      toggle () {
        this.open = !this.open
        this.changeEtat(this.open)
      },
      opened () {
        this.open = true
        this.changeEtat(this.open)
      },
      close () {
        this.open = false
        this.changeEtat(this.open)
      }
    },
    computed: {
      state () {
        if (this.open) {
          return 'open'
        } else {
          return 'close'
        }
      }
    },
    components: {
      categories,
      marques,
      profil,
      scrollbar,
      'auth-dispatch': authDispatch
    }
  })
</script>
