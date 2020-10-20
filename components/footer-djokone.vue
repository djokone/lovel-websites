<template>
  <div class="footer" id="footer">
    <div class="footer-container">  
      <div class="colFooter">
        <h3 class="smallTitle">Nous Retrouver :</h3>
        <p>
          <a class="specialColor" href="https://stationf.co/fr/" target="_blank" rel="noopener">Station F</a> <br>
          5 Parvis Alan Turing, 75013 Paris <br>
          Métro 6 - Chevaleret <br>
          Métro 14 - Bibliothèque François Mitterand <br>
        </p>

      </div>
      <div class="colFooter">
          <h3 class="smallTitle">Mentions :</h3>
          <ul class="list">
            <li><router-link :to="{name: 'pacteDeGalanterie'}">Pacte de galanterie</router-link></li>
            <li><router-link :to="{name: 'safeDating'}">Safe Dating</router-link></li>
            <li><a href="https://drive.google.com/open?id=1qY7h80T3y5aKKiQmeOxhuWMOE5PDBBwP" download>TO UPDATE Presse</a></li>
            <li><router-link :to="{name: 'contact'}">Contact</router-link></li> 
          </ul>
      </div>
      <div class="colFooter">
        <h3 class="smallTitle">Support :</h3>
        <ul class="list">
          <li><router-link :to="{name: 'conditions'}">Conditions générales</router-link></li>
          <li><router-link :to="{name: 'mentionsLegales'}">A propos</router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'lovelFooter'
    }
</script>

<style scoped>
  #footer{
    /*padding-bottom: 30px;*/
  }
</style>