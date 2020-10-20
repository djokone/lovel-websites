<template>
  <div class="__workSidbar">
    <ul class="__edition_bar">
      <li class="list_item">
        <router-link :to="{name: 'adminProduitAdd'}" class="btn_icone icomoon medium">
          e
        </router-link>
      </li>
      <li class="list_item">
        <router-link :to="{name: 'adminProduitsIndex'}" class="btn_icone icomoon medium">
          i
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'slideshow-options'
  }
</script>

<style scoped>

</style>