<template>
  <section class="container multi" id="subscription">
    <div class="contain" id="signUp">
      <div class="left" id="subscribe">
        <div class="baseline out-contain">
          <h2 class="title out-fill-bg">Oserez-vous relever <wbr>
            tous <wbr>les défis pour trouver <wbr>votre partenaire ?
          </h2>
        </div>
        <div v-show="send">
        </div>
        <div class="membre">
          <form class="out-contain">
            <!--<recaptcha-->
                    <!--ref="invisibleRecaptcha"-->
                    <!--@verify="onVerify"-->
                    <!--@expired="onExpired"-->
                    <!--size="invisible"-->
                    <!--:sitekey="sitekey">-->
            <!--</recaptcha>-->
            <label for="mail" class="label">Prêt à tenter <wbr>l'aventure avec nous :</label>
            <div class="inputBlock">
              <input type="text" class="input" placeholder="MyFunnyName@lovel.com" id="mail" v-model="mail">
              <div class="error" v-show="!isMailValid && showError">
                <p>L'adresse e-mail ne semble pas valide.</p>
              </div>
            </div>
            <div class="out-contain">
              <button type="submit" class="btn send col12 solidBorder" @click.prevent="register">
                  <span v-if="!isMailValid">
                      Je souhaite être informé⋅e des nouveautés !
                  </span>
                  <span v-else>
                      Enregistrer mon mail
                  </span>

              </button>
            </div>
            <div class="out-contain" v-if="update !== 1">
              <button class="btn send solidBorder col6" value="Je soutiens le projet !" @click="register">
                Je soutiens le projet !
              </button>
              <button class="btn send solidBorder col6" >
                Je deviens béta-testeur
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class=" col5 fullHeight imgCont hide-phone" id="appDemo">
        <img src="~assets/Design/mockup-phone-women.png" alt="" class="appPhone">
      </div>

    </div>
  </section>
</template>
<!--<script src='https://www.google.com/recaptcha/api.js'></script>-->
<script>
  /* eslint no-useless-escape: "error" */
  // import recaptcha from 'vue-recaptcha'
  import isEmail from 'validator/lib/isEmail'
  import { mapActions } from 'vuex'
  // import recaptcha from '@finpo/vue2-recaptcha-invisible'

  export default {
    name: 'subscription',
    data () {
      return {
        sitekey: '6Lem1QgTAAAAAP7YQnwHq70cWdy5qtmoSRGtIlnU',
        mail: '',
        showError: false,
        errors: {},
        errorCount: 0,
        step: 1,
        send: false,
        update: 1
      }
    },
    computed: {
      randomClass () {
        let classes = ['multi', 'one']
        let i = this.getRandomInt(classes.length)
        return classes[i]
      },
      isMailExist () {
        if (this.errors['mail'] && this.errors['mail']['_isUnique']) {
          return false
        } else if (!this.send) {
          return true
        } else {
          return true
        }
      },
      isMailValid () {
        return isEmail(this.mail)
      }
    },
    methods: {
      ...mapActions(['subscribe']),
      setErrors (res) {
        this.errors = res.data.errors
      },
      getRandomInt (max) {
        return Math.floor(Math.random() * Math.floor(max))
      },
      getError (name, error) {
        if (!error && this.errors && this.errors[name]) {
          return this.errors[name]
        } else if (this.errors && this.errors[name] && this.errors[name][error]) {
          return this.error[name][error]
        } else {
          return false
        }
      },
      register () {
        this.showError = true
        let that = this
        if (this.isMailValid) {
          this.send = true
          let data = {
            mail: this.mail
          }
          this.subscribe({
            data,
            config: {notif: false}})
          .catch(this.setErrors)
          .then(() => {
            // eslint-disable-next-line no-undef
            localStorage.setItem('register-mail', data.mail)
            that.$router.push({name: 'profil'})
          })
          // this.$refs.invisibleRecaptcha.execute()
        }
      },
      onSubmit () {
        // console.log('test')
        // this.$refs.invisibleRecaptcha.execute()
      },
      onVerify () {
        // console.log('verify')
      },
      onExpired () {
        // console.log('expiré')
      }
    },
    components: {
      // recaptcha
    }
  }
</script>

<style lang="scss" scoped>
  .imgCont {
    position: relative;
    /*position: absolute;*/
    bottom: 0px;

  }
  .appPhone {
    /*margin-top: -120px;*/
    /*width: 100%;*/
    /*transform: rotate(-24deg);*/
    /*bottom: 0px;*/
    /*margin-bottom: 20px;*/
  }
  .membre {
    margin-top: 30px;
    margin-bottom: 300px;
  }
  .baseline {
    margin-top: 60px;
  }
  .left{
    /*margin-bottom: 200px;*/
  }
</style>