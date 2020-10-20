<template>
<footer>
    <div class="colFooter">
        <h3 class="smallTitle">Mentions nécessaires :</h3>
        <ul class="list">
          <li><router-link :to="{name: 'conditions'}">Conditions générales</router-link></li>
          <li><router-link :to="{name: 'mentionsLegales'}">Mentions légales</router-link></li>
          <li><router-link :to="{name: 'confidentialPolicy'}">Politique de confidentialité</router-link></li>
          <li><router-link :to="{name: 'confiancePact'}">Pacte de confiance</router-link></li>
        </ul>
        <!-- <p>
            <a class="specialColor" href="https://stationf.co/fr/" target="_blank" rel="noopener">Station F</a> <br>
            5 Parvis Alan Turing, 75013 Paris <br>
            Métro 6 - Chevaleret <br>
            Métro 14 - Bibliothèque François Mitterand <br>
        </p> -->
    </div>
    <div class="colFooter">
        <h3 class="smallTitle">Mentions (très) importantes :</h3>
        <ul class="list">
          <li><router-link :to="{name: 'pacteDeGalanterie'}">Pacte de galanterie</router-link></li>
          <li><router-link :to="{name: 'safeDating'}">Safe Dating</router-link></li>
          <li><a href="https://drive.google.com/open?id=1qY7h80T3y5aKKiQmeOxhuWMOE5PDBBwP" download>TO UPDATE Presse</router-link></a></li>
          <li><router-link :to="{name: 'contact'}">Contact</router-link></li> 
        </ul>
    </div>
</footer>
</template>

<script>
export default {
  name: 'FooterNail'
}
</script>

<style>

</style>