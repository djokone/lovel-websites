<style lang="scss">
  #login {
    height: 500px;
  }
</style>

<template>
  <section class="container LvSix" id="login">
    <login/>
  </section>
</template>

<script>
import login from '../Templates/login'

export default {
  name: 'loginPage',
  components: {
    login
  }
}
</script>