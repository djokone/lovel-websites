
<template>
<div class="sidebar" style="margin-top: 40px">
  <div v-if="isMarqueLoaded" class="sidebar_marque">
    <h2>Marques</h2>
    <list
        name="marque"
        :items="marques">
    </list>
  </div>
  <loader v-if="!isMarqueLoaded"></loader>
</div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import list from '@/Modules/Lists/Templates/list'
  import loader from '@/Modules/Loader/Templates/loader'

  export default({
    name: 'Marques',
    computed: {
      ...mapGetters({
        marques: 'onlineMarques',
        isMarqueLoaded: 'isMarqueLoaded'
      })
    },
    components: {
      list,
      loader
    }
  })
</script>
