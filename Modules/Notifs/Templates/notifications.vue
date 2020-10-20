<template>
<div id="allNotification">
  <notif
    v-for="notif in notifs"
    :id="notif.id"
    :message="notif.message"
    :types="notif.type"
    :debug="debug"
    >
  </notif>
  
</div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import notif from './notif'
  
  export default {
    name: 'notifications',
    props: {
      debug: {
        default: false
      }
    },
    computed: {
      ...mapGetters({
        notifs: 'allNotifs'
      })
    },
    components: {
      notif
    }
  }
</script>