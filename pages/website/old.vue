<style lang="scss" src="~/assets/css/main.scss"></style>

<template>
    <div id="website">
        <Navbar/>
        <!-- <myMenu/> -->
        <!-- <notifications/> -->
        <nuxt-child/>
        <Footer/>
    </div>
</template>

<script>
  export default {
    name: 'website',
    components: {
    }
  }
</script>

<router lang="js">
{
alias: '/number-page'
}
</router>
