<template>
    <section class="container multi" id="subscription">
    <div class="contain" id="congrat">
        <div class="titleBlock">
            <h1 class="title out-fill-bg"><mark class="highlight"> Félicitations </mark></h1><br>
            <h3 class="subtitle out-fill-bg" v-if="hasMail"><mark class="highlight">Tu es inscrit sur la liste ultra select des Bêta-testeurs Lovel !</mark></h3>
        </div>
        <img src="https://media.giphy.com/media/l4JyOCNEfXvVYEqB2/giphy.gif" class="welcome" alt="">
    </div>
    </section>
</template>

<script>
  export default {
    name: 'congratulation',
    mounted () {
      // eslint-disable-next-line no-undef
      if (this.mail === null) {
        this.$router.push({name: 'subscribe'})
      }
    },
    computed: {
      hasMail () {
        return this.mail !== null
      },
      showMail () {
        return this.mail === null ? '' : this.mail
      },
      mail () {
        // eslint-disable-next-line no-undef
        return localStorage.getItem('register-mail')
      }
    }
  }
</script>

<style scoped>

</style>