<template>
    <div class="settingsList">

    </div>
</template>

<script>
  export default {
    name: 'settings-list',
    computed: {
      settingsList () {
        return this.$store.getters['entities/settings/query']().get()
      }
    }
  }
</script>

<style scoped>

</style>