<template>
<section class="formulaire">
    <div class="fake"></div>
    <Typeform :url="'https://franoisdechiara.typeform.com/to/GEFc3m'" class="t-form" @submit="finish"/>
</section>
</template>

<script>
  import Typeform from '@/Modules/Typeform/Typeform'

  export default {
    components: {
      Typeform
    },
    name: 'profil-typeform',
    mounted () {
    },
    computed: {
    },
    methods: {
      finish () {
        this.$ga.event('typeform', 'creation profil', 'profil', true)
        this.$router.push({name: 'wellcome'})
      }
    }
  }
</script>

<style>






/* .layout-container__Root-m4c84g-0 {
    position: relative;
    top: -170px;
} */

/* .jWJcPh {
    position: relative;
    top: -170px;
} */

/*
.sc-htoDjs {
    position: relative;
    top: -100px;
}

.brporR {
    position: relative;
    top: -100px;
} */

/* .e12baen60 {
} */
</style>
