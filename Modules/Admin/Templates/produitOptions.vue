<template>
  <div class="__workSidbar">
    <ul class="__edition_bar">
      <li class="list_item">
        <router-link :to="{name: 'adminProduitAdd'}" class="btn_icone icomoon medium">
          d
        </router-link>
      </li>
      <li class="list_item">
        <router-link :to="{name: 'adminProduitsIndex'}" class="btn_icone icomoon medium">
          r
        </router-link>
      </li>
      <li class="list_item">
        <router-link :to="{name: 'priceChange'}" class="btn_icone icomoon medium" exact-active-class>
          v
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import marque from '@/Modules/Icones/Templates/marque'
  export default {
    name: 'produitOptions',
    components: {
      marque
    }
  }
</script>
