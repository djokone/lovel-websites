<template>

</template>

<script>
  /**
   * A tool panel to manages all the databases and tables
   * WIP
   * @todo Scan all register database
   * @WorkInProgess
   */
  export default {
    name: 'export-database',
    data () {
      return {
      }
    },
    computed: {
      currentDatabase () {
        return this.$store.getters.currentDatabaseId
      }
    }
  }
</script>

<style scoped>

</style>
