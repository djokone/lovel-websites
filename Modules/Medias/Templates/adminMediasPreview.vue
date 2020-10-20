<template>
  <div>
    <h3>
      Liste des medias de cet utilisateur
    </h3>
    <el-form :inline="true">
      <el-form-item v-for="(media, index) in usersMedias" :key="index">
        <el-image
        style="width: 100px; height: 100px"
        :src="media.storage_uri"
        :preview-src-list="[media.storage_uri]"
        >
        </el-image><br>
        <el-button @click="deleteMedia(media)" type="danger" icon="el-icon-delete" circle></el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import LoadCurrentDatabase from '@/Modules/DatabasesManager/Mixins/loadCurrentDatabase'
  import { mapActions } from 'vuex'

  export default {
    name: 'adminMediasPreview',
    props: {
      user: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    mixins: [LoadCurrentDatabase],
    load: {
      actions: []
    },
    computed: {
      usersMedias () {
        return this.$store.getters[this.database + '/medias/query']()
          .where('ref_id', this.user.id)
          .get()
      }
    },
    methods: {
      ...mapActions(['adminDeleteMedia']),
      deleteMedia (row) {
        this.adminDeleteMedia({
          id: row.id
        })
      }
    }
  }
</script>
