<style lang="scss">
  .notif_error{
    .picto_notif{
      background: #E3001B;
    }
  }
  .notif_success{
    .picto_notif{
      background: #47CA00;
    }
  }
  .notification{
    cursor: pointer;
    // width: 300px;
    // display:
    margin: 20px;
    display: flex;
    margin-right: 30px;
    align-items: center;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
  }
  .notif_text{
    display: block;
    float: left;
    padding: 12px;
    width: 300px;
    background: rgba(255, 255, 255, 0.8);
  }
  .icone_left {
    margin-right: -30px;
    // position: absolute;
    // right: 50px;
  }
  .shadow{
    position: absolute;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
    right: 0px;
    height: 60px; width: 60px;
    transform : rotate(45deg);
  }
  .picto_notif{
    margin-left: 30px;
    height: 60px; width: 60px;
    // padding: 10px;
    transform : rotate(45deg);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
    img{
      transform : rotate(-45deg);
    }
  }
  
</style>

<template>
<div>
  <transition name="fade" appear>
    <div class="notification" v-if="visible" @click="hide" :class="getClass">
      <div class="notif_text">
        <p>
          {{message}}
        </p>
      </div>
      <!-- <div class="shadow">
      </div> -->
      <!--<div class="icone_left">-->
        <!--<div class="picto_notif" >-->
          <!--<img :src="getImg" alt="">-->
        <!--</div>-->
      <!--</div>-->
      
    </div>
  </transition>
  
</div>
  
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    name: 'notif',
    data () {
      return {
        visible: true
      }
    },
    props: {
      id: {
        type: Number
      },
      message: {
        type: String
      },
      types: {
        default: 'success'
      },
      debug: {
        default: false
      }
    },
    methods: {
      ...mapActions({
        'closeNotif': 'closeNotif'
      }),
      hide () {
        this.visible = false
        this.closeNotif({id: this.id})
      }
    },
    mounted () {
      setTimeout(this.hide, 10000)
    },
    computed: {
      getImg () {
        if (this.types === 'error') {
          return '/static/error.png'
        }
        if (this.types === 'success') {
          return '/static/success.png'
        }
      },
      getClass () {
        if (this.types === 'error') {
          return 'notif_error'
        }
        if (this.types === 'success') {
          return 'notif_success'
        }
      }
    }
  }
</script>

<style lang="scss">
  .notification{
    
    opacity: 0;
    transform: translateX(-50px);
  }
  .notification{
    opacity: 1;
    transform: translateX(0px);
    transition: opacity 0.3s, transform 0.5s;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s, transform 0.5s;
  }
  .fade-enter-active, .fade-leave-active {
    opacity: 0;
    transform: translateX(50px);
  }
</style>