<style>
</style>

<template>
<div class="userForm">
<h2>Information de connexion</h2>
  <div class="input">
    <label for="username">Username</label> <br>
    <input type="text" v-model="data.username" id="username">
  </div>
  <div class="input">
    <label for="mail">mail</label> <br>
    <input type="text" v-model="data.mail" id="mail">
  </div>
</div>
  
</template>

<script>
  export default ({
    props: {
      data: {
        type: [Object, Array]
      },
      errors: {
        type: [Object, Array]
      }
    }
  })
</script>
