<template>
    <div>
        <router-view></router-view>
        <social/>
    </div>
</template>

<script>
  import social from '@/Modules/Subscription/social'

  export default {
    name: 'Subscribe',
    components: {
      social
    }
  }
</script>
