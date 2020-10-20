<template>
    <div>
        <section class="container multi" id="subscription">
            <div class="contain" id="profile">
                <Typeform :url="'https://franoisdechiara.typeform.com/to/GEFc3m'" class="embed" @submit="finish"/>
            </div>
        </section>
    </div>
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
    html {
        overflow-x: hidden;
    }
</style>
