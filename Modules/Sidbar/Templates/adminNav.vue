<style lang="scss">
  a {

  }
  ul {
    list-style: none;
    padding: 0px;
  }
</style>

<template>
  <div id="admin-nav">
    <div class="logo">
      <router-link :to="{name: 'home'}"><img src="~assets/Design/logo-icon-app.png" alt="" ></router-link>
    </div>
    <ul class="__root_menu">
      <!-- <li><router-link :to="{name: 'produit'}">Catégorie</router-link></li> -->
      <li>
        <router-link :to="{name: 'dash'}" class="__item_menu icomoon big">
          &#xe9a6
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'adminChallengesIndex'}" class="__item_menu icomoon big" :class="{'router-link-active': subIsActive('/challenges')}">
          &#xe9a9
        </router-link>
      </li>
      <li><!-- <router-link :>Projet</router-link> --></li>
      <li>
        <router-link :to="{name: 'adminInteretsIndex'}" class="__item_menu icomoon big" :class="{'router-link-active': subIsActive('/interets')}" >
          &#xe9ba
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'adminUsersIndex'}" class="__item_menu icomoon big" :class="{'router-link-active': subIsActive('/users')}" >
          &#xe972
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'adminSettingsIndex'}" :class="{'router-link-active': subIsActive('/settings')}" class="__item_menu icomoon big">
          &#xe995
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'logout'}" class="__item_menu icomoon big" :class="{'router-link-active': subIsActive('/logout')}" >
          &#xe9b6
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  /**
   * Usage : `<adminNav>` for admin sidebar
   * @deprecated
   */
  export default {
    name: 'adminNav',
    methods: {
      /**
       * Check if sub path is active
       * @param {string} input - Matching path
       * @return {number}
       */
      subIsActive (input) {
        const paths = Array.isArray(input) ? input : [input]
        return paths.some(path => {
          return this.$route.path.indexOf(path) !== -1 // current path starts with this path string
        })
      }
    }
  }
</script>
