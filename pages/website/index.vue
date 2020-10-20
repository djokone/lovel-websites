<template>
  <div>
<!--    <h1 margin-top="300px">yoooooooooooooooooooooooooooooo</h1>-->
    <nuxt-child>
    </nuxt-child>
    <section class="intro">
      <div class="intro-text desk-display">
        <h2>Choisis le jeu...<br> Change les régles</h2>
        <p>Oseras-tu relever les défis pour séduire ton Crush?</p>
        <form>
          <input id="mailInput" type="text" placeholder="exemple@Email"  v-model="mail"/>
          <button v-on:click.prevent="sub" type="submit">JE M'INSCRIS !</button>
        </form>
      </div>
      <div class="intro-text phone-display">
        <h2>Choisis<br>le jeu...<br> Change<br> les régles</h2>
        <p>Oseras-tu relever les défis<br>pour séduire ton Crush ?</p>
        <form>
          <input id="mailInput" type="text" placeholder="exemple@Email" v-model="mail" required/>
          <button type="submit">JE M'INSCRIS !</button>
        </form>
      </div>
      <div class="intro-img">
        <img src="~/assets/MOCKUP@2xcropped.png" alt="mockupMatch">
      </div>
      <!-- **************** TEST ZONE ****************************** -->
      <!-- <div class="inputBlock">
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
      </div> -->
      <!-- **************** TEST ZONE ****************************** -->


    </section>

    <div class="video">
      <div class="mockup">
        <img src="~/assets/mockup-nahil@2x.png" alt="mockup">
      </div>
      <p class="discover">&#128071 Découvrir la video ! &#128071</p>
      <iframe width="100%" src="https://www.youtube.com/embed/CPPUSzus2rc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <p class="sticker">Ouais la vidéo est cool, mais...<br> <strong>{Encore !}</strong> une nouvelle application <br> de rencontre...?</p>
    </div>

    <section class="solution">
      <h2>Oui mais sur Lovel,<br> on change les règles du jeu :</h2>
      <div class="rules-container">
        <div class="rules first-rules">
          <div class="title-icon-first">
            <img src="~/assets/messagerie.svg" class="svgicon phone-display" alt="histoire">
            <h3 class="phone-display">
              On a bloqué la messagerie
            </h3>
            <h3 class="desk-display">
              On a bloqué<br> la messagerie
            </h3>
            <img src="~/assets/messagerie.svg" class="svgicon desk-display" alt="histoire">
          </div>
          <p>
            Stop au harcèlement ✋🛑 ! La messagerie se mérite et pour la débloquer,
            il faudra jouer ! Un défi chacun pour se dévoiler et vous découvrir en
            fonction de vos passions
          </p>

          <div class="title-icon-first">
            <img src="~/assets/createur.svg" class="svgicon phone-display"  alt="histoire">
            <h3 class="phone-display">
              On créé des histoires avant tout !
            </h3>
            <h3 class="desk-display">
              On créé des histoires<br> avant tout !
            </h3>
            <img src="~/assets/createur.svg" class="svgicon desk-display"  alt="histoire">
          </div>
          <p>
            Vivez de vraies histoires plutôt que de multiplier les rencontres.
            Fini le temps des “Salut, tu fais quoi dans la vie ?” 💤😔 créez
            des souvenirs mémorables et durables. Sur Lovel, aucun match ne ressemble
            au précédent
          </p>
        </div>
        <img class="solution-mockup" src="~/assets/nvx-mockup@2x@2x.png" alt="mockup">
        <div class="rules second-rules">
          <div class="title-icon-second">
            <img src="~/assets/icebreaker.svg" class="svgicon" style="max-height:55px" alt="histoire">
            <h3 class="phone-display">
              Les défis pour briser la glace...
            </h3>
            <h3 class="desk-display">
              Les défis<br>pour briser la glace...
            </h3>
          </div>
          <p>
            Plus de 500 défis pensés afin d’éviter la gêne des premiers messages.
            Vous aimez tous les deux la musique 🎷 ? Partage-lui ton son du moment
            Plutôt sportif 🏅 ? Mets-toi en avant en réalisant 10 abdos
            Au moment de discuter, la glace est déjà brisée et il te suffit de faire
            parler ton charme naturel
          </p>
          <div class="title-icon-second">
            <img src="~/assets/noswipe.svg" class="svgicon" style="max-height:58px" alt="histoire">
            <h3>
              Pas de swipe, but...
            </h3>
          </div>
          <p>
            On sait que le Swipe est cool, simple et efficace. Malgré tout,
            on trouve que c’est assez réducteur pour juger une personne. Pour cela,
            on l’a déplacé ! Tu gardes le plaisir de swiper nos nombreux défis, que
            tu peux next sans avoir peur de les vexer 🤳
          </p>

        </div>
      </div>
      <p class="convinced">
        Alors, <br>
        <span class="subtext">convaincu.e ?</span>
      </p>
      <button>télécharger</button>
      <div class="pink-rectangle"></div>
    </section>
    <Social/>
  </div>
</template>
<script>
// import Intro from '~/components/Intro.vue'
// import Video from '~/components/Video.vue'
// import Social from '~/components/Social.vue'
import {mapActions} from 'vuex'

export default {
  name: 'home',
  layout: 'website',
  components: {
    // Intro,
    // Video,
    // Social
  },
  data () {
    return {
      mail: ''
    }
  },
  methods: {
    ...mapActions(['subscribe']),
    sub () {
      console.log('SALUT')
      let that = this
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
    }
  }

}
</script>
<style>
button {
  font-family: 'Barlow Semi Condensed', sans-serif;
}

a {
  text-decoration: none;
  cursor: pointer;
}

i {
  color: #C9C9C9;
}

@media screen and (max-width: 900px) {
  .desk-display {
    display: none;
  }
}

@media screen and (min-width: 900px) {

  .desk-display {
    display: block;
  }

  .phone-display {
    display: none;
  }

  /* NAVBAR */

  .navbar {
    display: flex;
    justify-content: flex-start;
    width: 85%;
    margin: 20px auto 5px;
    max-width: 1350px;
  }

  .navbar ul {
    color: #27F2CB;
    font-family: 'Barlow Semi Condensed', sans-serif;
    text-transform: uppercase;
    font-weight: bolder;
    font-size: 20px;
    display: flex;
    align-self: center;
    width: 30%;
    justify-content: space-between;
  }

  .navbar ul li {
    display: inline;
  }

  .navbar img {
    width: 10%;
    height: auto;
  }

  .burger {
    display: none;
    font-size: 42px;
    color: #707070;
    margin-right: 13px;;
  }

  /* ********** */

  /* INTRO  */
  .intro {
    flex-direction: row;
    justify-content: space-between;
    height: fit-content;
    margin-bottom: -220px;
    max-width: 1350px;
  }

  .intro-img {
    float: right;
  }

  .intro-text {
    width: 66%;
    height: fit-content;
  }

  .intro img {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
    position: relative;
    top: -170px
  }

  /* ******** */

  /* VIDEO  */

  .video {
    margin-bottom: -118px;
  }

  .mockup {
    display: none;
  }

  .discover {
    font-size: 37px;
    margin: 23px;
  }

  iframe {
    height: 85vh;
  }

  .sticker {
    width: 70%;
    font-size: 1.5em;
    max-width: 585px;
  }


  /* ******** */

  /* SOLUTION  */
  .solution {
    padding-top: 66px;
  }

  /* .solution h2 {
      margin-bottom: 70px;
  } */

  .rules-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 88%;
    align-items: center;
    max-width: 1220px;
  }

  .title-icon-first {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .title-icon-second {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .svgicon {
    width: 17%;
    margin: 0 10px;
    height: auto;
  }

  .solution-mockup {
    width: 26%;
  }

  .rules {
    width: 30%;
    font-size: 1.3em;
  }

  .first-rules {
    align-self: flex-start;
    text-align: right;
  }

  .second-rules {
    align-self: flex-end;
    text-align: left;
  }

  .solution button {
    max-width: 830px;
    font-size: 4em;
    height: 125px;
    margin-bottom: -55px;
  }

  .pink-rectangle {
    height: 110px;
  }

  /* ******** */

  /* SOCIAL  */

  .social {
    font-size: 39px;
    padding-top: 25px;
  }

  .social-container {
    width: 62%;
  }

  .icons {
    font-size: 75px;
  }

  /* ******** */

  /* FOOTER */


  footer {
    flex-direction: row;
  }

  .colFooter {
    width: 50%;
  }

  /* ******** */



}
</style>
