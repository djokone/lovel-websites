<style lang="scss">
  @import "bourbon";
  .input{
    // padding: 1em;
    input, textarea, label{
      font-family: 'Montserrat';
      font-size: 1.2em;
    }
    input, textarea{
      padding: 0.5em;
      width: 100%;
      border: none;
      border-bottom: 2px solid #dedede;
      margin: 1em 0em;
      margin-top: 0em;
      &::placeholder {
        color: #dedede;
      }
    }
    input:focus, textarea:focus{
      border-color: red;
    }
  }
  .submit{
    margin-top: 40px;
    display:block;
    text-align:center;
    text-transform: uppercase;
    font-family: 'Montserrat';
    color: #e3001b ;
    cursor: pointer;
      border: #e3001b 1px solid;
      padding: 20px 40px;
      &:hover{
        background: #e3001b;
        color: white;
      }
    }
</style>

<template>
  <div id="signup__content">
    <router-view></router-view>
    <div id="content">
      <div id="signup">
        <div class="connexion">
          <h2>Information de connexion</h2>
          <form action="">
            <div class="input">
              <label for="username">Nom d'utilisateur</label> <br>
              <input type="text" v-model="form.user.username" id="username" placeholder="John">
            </div>
            <div class="input">
              <label for="mail">E-mail</label> <br>
              <input type="text" v-model="form.user.mail" id="mail" placeholder="John@doe.com">
            </div>
            <div class="input">
              <label for="password1">Mot de passe</label> <br>
              <input type="password" v-model="form.user.password" id="password1" placeholder="jojo583">
            </div>
            <!-- <div class="input">
              <label for="password2">Confirmation du mot de passe</label> <br>
              <input type="password" v-model="form.user.password2" id="password2" placeholder="jojo583">
            </div> -->
          </form>
        </div>
        <div class="profil" v-if="stepOne">
          <h2>Vos information de l'utilisateur du compte</h2>
          <form action="">
            <div class="input">
              <label for="nom">Nom</label> <br>
              <input type="text" v-model="form.rev.nom" id="nom" placeholder="Doe">
            </div>
            <div class="input">
              <label for="prenom">prenom</label> <br>
              <input type="text" v-model="form.rev.prenom" id="prenom" placeholder="John">
            </div>
            <div class="input">
              <label for="poste">Votre poste</label> <br>
              <input type="text" v-model="form.rev.poste" id="poste" placeholder="Assistant commercial">
            </div>
            <div class="input">
              <label for="phone">Téléphone professionnel</label> <br>
              <input type="text" v-model="form.rev.work_phone" id="phone" placeholder="06 48 58 77 96">
            </div>
          </form>
        </div>
        <div class="entreprise" v-if="stepTwo">
          <h2>Information de votre entreprise</h2>
          <form action="">
            <div class="input">
              <label for="socity">Nom de société</label> <br>
              <input type="text" v-model="form.socity.society_name" id="socity" placeholder="John & co">
            </div>
            <div class="input">
              <label for="activity">Activité de l'entreprise</label> <br>
              <input type="text" v-model="form.socity.activity" id="activity" placeholder="Vente matériel de cuisine">
            </div>
            <div class="input">
              <label for="sirret">N° Siret</label> <br>
              <input type="text" v-model="form.socity.siret" id="sirret" placeholder="732 829 320 00074">
            </div>
            <div class="input">
              <label for="adresse">Adresse</label> <br>
              <textarea type="text" v-model="form.socity.adresse" id="adresse" placeholder="1 rue de la fontaine"> </textarea>
            </div>
            <div class="input">
              <label for="Ville">Ville</label> <br>
              <input type="text" v-model="form.socity.city" id="Ville" placeholder="Serris">
            </div>
            <div class="input">
              <label for="postal">Code postal</label> <br>
              <input type="text" v-model="form.socity.postal" id="postal" placeholder="77700">
            </div>
            <div class="input">
              <label for="phone">Numéro de telephone</label> <br>
              <input type="text" v-model="form.socity.society_phone" id="phone" placeholder="06 48 58 77 96">
            </div>
            <div class="input">
              <label for="phone">Site web</label> <br>
              <input type="text" v-model="form.socity.website" id="website" placeholder="www.votresite.com">
            </div>

            <a @click="send" class="btn">Valider et continuer ...</a>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { each } from 'lodash'
  import {
    signup
  } from '../Services/actions'

  export default ({
    vuex: {
      actions: {
        signup
      }
    },
    data () {
      return {
        form: {
          user: {
            username: '',
            mail: '',
            password: ''
          },
          rev: {
            nom: '',
            prenom: '',
            poste: '',
            work_phone: ''
          },
          socity: {
            society_name: '',
            activity: '',
            siret: '',
            adresse: '',
            city: '',
            postal: '',
            society_phone: '',
            website: ''
          }
        }
      }
    },
    methods: {
      send () {
        let user = Object.assign(this.form.user, this.form.rev, this.form.socity)
        this.signup(user).then((response) => {
        })
      }
    },
    computed: {
      stepOne () {
        let is = true
        each(this.form.user, (v) => {
          if (v.length < 2) {
            is = false
          }
        })
        return is
      },
      stepTwo () {
        let is = true
        if (this.stepOne) {
          each(this.form.rev, (v) => {
            if (v.length < 2) {
              is = false
            }
          })
        } else {
          is = false
        }
        return is
      }
    }
  })
</script>