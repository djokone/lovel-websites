<style lang="scss">
  .content_accordeon{
    margin-top: 0px;
    border-left: 5px solid #e3001b; 
    &>div{
      padding-top: 40px;
    }
    // border-right: 5px solid #e3001b;
  }
  .__title{
    display: inline-block;
  }
  .tab{
    cursor: pointer;
    position: relative;
    padding: 20px 5px;
    z-index: 1;
    // border-bottom: 5px solid #BBBBBB; 
    border-left: 5px solid #BBBBBB; 
    border-right: 5px solid #BBBBBB; 
    background: #F6F6F6;
    h3{
      display: inline-block;
    }
    &:hover{
      color: #e3001b;
    }
    &.active{
      // color: white;
      z-index: 2;
      margin-bottom: -16px;
      background: none;
      border-bottom: none; 
      border-left: 5px solid #e3001b;
      box-shadow: 0px 5px 25px -8px rgba(0, 0, 0, 0.5);
      // border-right: 5px solid #e3001b; 
      .symb{
        background: #E4E4E4;
        color: black;
      }
    }
    .right__btns{
      position: relative;
      float: right;
      display: block;
      margin: 0px 10px;
      // margin: 10px 20px;
    }
    .symb{
      position: relative;
      float: right;
      // right: 20px; top: 50%; bottom: 0px;
      // margin-top: -15px;
      border-radius: 25px;
      background: #555555;
      color: white;
      font-weight: bold;
      font-size: 20px;
      width: 25px; height: 25px;
      text-align: center;
    }
  }
  
</style>

<template>
  <div class="accordeon-item">
    <div @click="toogle" class="tab" :class="activeClass">
      <slot name="title"></slot>
      <div class="symb">
        {{symbole}}
      </div>
      <slot name="btns"></slot>
    </div>
    
    <div class="content_accordeon" :class="activeClass">
      <slot name="content" v-if="isActive"></slot>
      
    </div>
  </div>
</template>

<script>
  export default ({
    data () {
      return {
        isActive: false
      }
    },
    computed: {
      symbole () {
        if (this.isActive) {
          return '-'
        } else {
          return '+'
        }
      },
      activeClass () {
        if (this.isActive) {
          return 'active'
        } else {
          return 'noActive'
        }
      }
    },
    methods: {
      toogle () {
        if (!this.isActive || this.$parent.toogle) {
          this.isActive = !this.isActive
          this.$parent.change(this._uid)
        }
      }
    }
  })
</script>