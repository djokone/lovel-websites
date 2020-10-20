<template>
  <div id="nologgin">
    <router-view></router-view>
  </div>
</template>

<script>
  import auth from '/authConfig'

  export default {
    name: 'nologgin',
    beforeRouteEnter (to, form, next) {
      if (!auth.isLogged()) {
        next()
      } else {
        next('/')
      }
    }
  }
</script>
