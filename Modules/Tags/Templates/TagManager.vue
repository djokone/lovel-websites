<template>
	<div>
    <el-tag
      :key="tag"
      v-for="(tag, index) in tagsList"
      closable
      :disable-transitions="false"
      @close="handleClose(index)">
      {{tag}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="mini"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ Ajouter un tag</el-button>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'tag-manager',
    props: {
      tags: [Array, Boolean, Object],
      interestId: String
    },
    data () {
      return {
        inputVisible: false,
        inputValue: ''
      }
    },
    computed: {
      currentDatabase () {
        return this.$store.getters.currentDatabaseId
      },
      // _tags () {
      //   let query = this.getters[currentDatabase + '/tags/query']()
      //   query.where('')
      // },
      tagsList () {
        let list = []
        if (Array.isArray(this.tags)) {
          this.tags.forEach((tag) => {
            list.push(tag.name)
          })
        }
        return list
      }
    },
    methods: {
      ...mapActions(['adminAddTagToInterest', 'adminDeleteTagToInterest']),
      handleClose (index) {
        let tag = this.tags[index]
        this.adminDeleteTagToInterest({
          interestId: this.interestId,
          tagId: tag.id,
          removeTagAuto: true
        })
        // console.log(tag)
        // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          this.adminAddTagToInterest({
            tag: {name: inputValue},
            interestId: this.interestId
          })
        }
        this.inputVisible = false
        this.inputValue = ''
      }
    }
  }
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
