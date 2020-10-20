<template>
  <el-menu
    default-active="2"
    style="height:100%;"
    class="el-menu-vertical-demo"
    :collapse="collapse">
    <el-menu-item index="1">
      <router-link :to="{name: 'dash'}" >
        <i class="icomoon icomoon-disposition">
          &#xe9a6
        </i>
        <span>Dashboard</span>
      </router-link>
    </el-menu-item>
    <el-menu-item index="2" @click="$router.push({name: 'adminChallengesIndex'})">
      <router-link :to="{name: 'adminChallengesIndex'}" class="">
        <i class="icomoon icomoon-disposition">&#xe9a9</i>
        <span>Challenges</span>
      </router-link>
    </el-menu-item>
    <el-menu-item index="3" @click="$router.push({name: 'adminInterestsIndex'})">
      <router-link :to="{name: 'adminInterestsIndex'}">
        <i class="icomoon icomoon-disposition">&#xe9ba</i>
        <span>Centres d'intérets</span>
      </router-link>
    </el-menu-item>
    <el-menu-item index="4" @click="$router.push({name: 'adminUsersIndex'})">
<!--      <router-link :to="{name: 'adminUsersIndex'}">-->
<!--        <i class="el-icon-icomoon">&#xe972</i>-->
<!--        <span>Utilisateurs</span>-->
<!--      </router-link>-->
    </el-menu-item>
    <el-menu-item index="5" @click.prevent="$router.push({name: 'adminSettingsIndex'})">
      <router-link :to="{name: 'adminSettingsIndex'}">
        <i class="el-icon-icomoon">&#xe995</i>
        <span>Paramètres</span>
      </router-link>
    </el-menu-item>
    <el-menu-item index="6" @click="toogleSidbar">
      <i class="el-icon-arrow-right" v-if="collapse"></i>
      <i class="el-icon-arrow-left" v-if="!collapse"></i>
      <span v-show="!collapse">Réduire</span>
    </el-menu-item>
  </el-menu>
</template>
<style lang="scss" src="~/Modules/Admin/scss/admin.scss"></style>
<script>
  export default {
    name: 'el-sidebar-admin',
    data () {
      return {
        collapse: true
      }
    },
    methods: {
      toogleSidbar () {
        this.collapse = !this.collapse
      }
    }
  }
</script>

<style>
</style>
