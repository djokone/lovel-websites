<template>
    <div>
        <section class="container sixTop" id="exemple">
            <div class="contain">
                <div class="pres">
                    <div class="contain">
                        <img src="~assets/Design/defi.png" alt="" class="love-ico">
                    </div>

                    <h2 class="strongTitle">Lovel : Créateur de complicité</h2>
                    <h3 class="flag">
                        Réalisez des défis basés sur vos centres d'intérêts afin de gagner de nombreuses récompenses
                    </h3>
                    <p class="homeP">
                        <router-link :to="{name: 'subscribe'}" name="inscription" class="btn send">S'inscrire</router-link>
                        <br>
                        <br>Nous proposons aux célibataires une expérience inédite qui leur permet de se découvrir par la vidéo, la photo et le son avec des défis à réaliser proposés en fonction de leurs centres d'intérêt communs !
                    </p>
                    <p class="homeP">
                        L'application propose plusieurs paliers à compléter avec à chaque fois une super récompense à la clé ! D'ailleurs, pas de messagerie au début d'un match, c'est le premier objectif à débloquer !
                        <br>
                        Du coup fini les conversations creuses et place à une vraie complicité avant même d'avoir échangé les premiers mots ! <br> <br>
                        <span class="bold">Alors prêt à relever le défi du romantisme 3.0 ?</span>
                        <br>
                        <br>
                    </p>

                </div>
                <div class="exempleContain">
                    <router-link name="inscription beta" :to="{name: 'subscribe'}" >
                        <img src="~assets/Design/Exemple-defi.png" alt="" class="exempleImg">
                    </router-link>

                </div>
            </div>
        </section>
        <!--<exemple></exemple>-->
        <section class="container">
            <social></social>
        </section>
    </div>
</template>

<script>
  // import exemple from './exemple'
  import social from '@/Modules/Subscription/social'
  export default {
    name: 'home',
    components: {
      // exemple,
      social
    }
  }
</script>

<style>

</style>
