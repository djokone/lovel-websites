<template>
    <div>
        <subscriptionList/>
    </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import subscriptionList from '../Templates/adminSubscriptionsList'

  export default {
    name: 'admin-subscriptions-list',
    components: {
      subscriptionList
    },
    methods: {
      ...mapActions(['initSubscriptions'])
    }
  }
</script>

<style scoped>

</style>