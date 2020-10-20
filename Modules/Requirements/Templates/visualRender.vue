<template>
  <div>
    <p><h3>Rendu visuel de la logique paramètre</h3>
    <el-card>
      {{renderString}}
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'visualRender',
    props: {
      type: {
        type: Object,
        default () {
          return {}
        }
      },
      logicGroup: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        displayName: ''
      }
    },
    computed: {
      renderString () {
        let visualRender = this.displayName + ' '
        for (let i = 0; i !== this.logicGroup.logicGroups.length;) {
          visualRender += this.logicGroup.logicGroups[i].label
          i++
          if (i !== this.logicGroup.logicGroups.length) {
            visualRender += ' ' + this.logicGroup.logicOperator + ' '
          }
        }
        return visualRender
      }
    },
    watch: {
      type () {
        if (Object.keys(this.type).length !== 0) {
          this.setDisplayName()
        }
      }
    },
    methods: {
      setDisplayName () {
        if (this.displayName.length === 0) {
          this.displayName = this.type.displayName
        }
      }
    }
  }
</script>