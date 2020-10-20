<template>
  <div class="profil" v-if="isLoaded">
    <div class="user">
      <div class="thumb">
        <thumb
          v-if="hasThumb"
          :mode="'crop'"
          :src="user.thumb.file"
          :width="width"
          :height="height">
        </thumb>
        <!-- <img src="../../../assets/avatar.jpg" class="thumb" alt=""> -->
      </div>
      <div class="info">
        <h3>{{user.profil.prenom}} <b>{{user.profil.nom}}</b></h3>
        <h4 v-if="hasCompagny"><i>{{user.company.name}}</i></h4>

      </div>
    </div>
      <div class="nav">
        <router-link
          v-for="mode in allMode"
          href="#"
          @click="changeMode(mode.name)"
          class="onglet"
          :class="activeMode(mode.name)"
          :to="mode.link">
          <img
          :src="serveur + '/img/picto/' + mode.src"
          :class="mode.name"
          alt="">
          <h4>{{mode.text}}</h4>
        </router-link>
      </div>
    <!-- <p class="welcom">
    Bonjour
    <span class="red bold">
      {{user.username | ucfirst}}
    </span>
    <div class="thumb">
      <img src="../../../assets/avatar.jpg" alt="">
    </div>
    <div class="controle">
      <a href="#" class="btn">Profil</a>
      <a href="#" class="btn">Editer</a>
    </div>
    </p> -->
    <div class="encre" v-if="checkActive('reglages')">
      <ul>
        <li>
          <router-link :to="{name: 'editPhoto'}">
            Ma photo
          </router-link>
        </li>
        <li>
          <router-link :to="{name: 'editProfil'}">
            Mon profil
          </router-link>
        </li>
        <li>
          <router-link :to="{name: 'editSociety'}">
            Ma société
          </router-link>
        </li>
        <li>
          <router-link :to="{name: 'editWebsite'}">
            Mon Site
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { isEmpty } from 'lodash'
  import { mapGetters } from 'vuex'

  import thumb from '@/Modules/Medias/Templates/thumb'
  export default ({
    name: 'ProfilSidbar',
    data () {
      return {
        serveur: process.env.CONFIG.IMAGES,
        allMode: [
          {
            name: 'dash',
            src: 'dashboard.png',
            text: 'Tableau de bord',
            link: {name: 'editAll'}
          },
          {
            name: 'commandes',
            src: 'commande.png',
            text: 'Commandes',
            link: {name: 'editAll'}
          },
          {
            name: 'reglages',
            src: 'reglages.png',
            text: 'Réglages',
            link: {name: 'editAll'}
          }
        ],
        mode: false,
        height: {
          val: 100,
          unity: '%'
        },
        width: {
          val: 100,
          unity: '%'
        }
      }
    },
    methods: {
      changeMode (name) {
        this.mode = name
      },
      activeMode (name) {
        if (name === this.mode) {
          return 'active'
        }
      },
      checkActive (name) {
        return name === this.mode || this.$route.name === 'editProfil'
      }
    },
    computed: {
      ...mapGetters({
        user: 'user',
        isLoaded: 'isAuthLoaded'
      }),
      hasThumb () {
        if (!isEmpty(this.user.thumb)) {
          return true
        } else {
          return false
        }
      },
      hasCompagny () {
        return !isEmpty(this.user.company)
      }
    },
    filters: {
      ucfirst (value) {
        if (typeof value === 'string') {
          return value.charAt(0).toUpperCase() + value.slice(1)
        } else {
          return value
        }
      }
    },
    components: {
      thumb
    }
  })
</script>
