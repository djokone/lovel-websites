<style lang="scss">
  .panel_slot{
    position: relative;
    width: 100%;
    margin: 30px 0px 15px 0px; 
    cursor: pointer;
    &:hover{
      color: red;
    }
  }
  .panel_picto{
    position: absolute;
    right: 0px;
    top: 0px;
    font-weight: bold;
    font-size: 1.2em;
  }
</style>

<template>
  <div>
    <div class="panel_slot" @click="toogle">
      <slot name="head"></slot> <span class="panel_picto">{{picto}}</span>
      <hr>
    </div>
    <div class="panel_content" v-show="open">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default ({
    name: 'panel',
    data () {
      return {
        open: true
      }
    },
    props: {
      openDefault: {
        default: true,
        type: Boolean
      }
    },
    created () {
      this.open = this.openDefault
    },
    computed: {
      picto () {
        if (this.open) {
          return '-'
        } else { return '+' }
      }
    },
    methods: {
      toogle () {
        this.open = !this.open
      }
    }
  })
</script>