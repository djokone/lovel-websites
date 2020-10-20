
<template>
  <div id="loginForm" class="contain">
    <h2>Se connecter</h2>
    <p class="error" v-if="error">{{loginForm.error}}</p>
    <form action="">
      <div class="inputBlock">
        <input type="text" class="input" placeholder="Votre adresse mail" v-model="loginForm.mail" id="mail">
      </div>
      <div class="inputBlock">
        <input type="password" class="input" placeholder="Mot de passe" v-model="loginForm.password" id="mdp">
      </div>
      <!-- <h2>Se connecter</h2> -->
      <button class="btn submit" @click.prevent="save">Se connecter</button>
    </form>
  </div>
</template>

<script>
// import auth from '@/config/Auth'
import { mapActions } from 'vuex'

export default ({
  name: 'LoginForm',
  data () {
    return {
      error: false,
      loginForm: {
        error: '',
        mail: '',
        password: ''
      }
    }
  },
  // mounted () {
  // },
  // computed: {
  //   ...mapGetters({
  //     isLogged: 'isLogged'
  //   })
  // },
  methods: {
    ...mapActions({
      login: 'login'
      // getUser: 'getUser'
    }),
    async save () {
      let toSend = {mail: this.loginForm.mail, password: this.loginForm.password}
      try {
        await this.login(toSend)
        this.$router.push('admin')
      } catch (e) {
        this.loginForm.error = e
        process.env.NODE_ENV === 'development' ? console.error(e) : null
      }
    }
  }
})

</script>
