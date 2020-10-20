<template>
    <header id="nav" class="topNav">
        <router-link :to="{ name: 'website'}" class="logo">
        <img src="~assets/Design/logo-icon-app.png" alt="">
        <span class="logo-typo">LOVEL</span>
	    </router-link>
        <!--<ul class="menu">-->
            <!--<li class="item">-->
                <!--<nuxt-link :to="'team'">-->
	                <!--équipe-->
                <!--</nuxt-link>-->
            <!--</li>-->
        <!--</ul>-->
    </header>
</template>

<script>
    export default {
      name: 'navbar'
    }
</script>

<style lang="scss">

</style>
