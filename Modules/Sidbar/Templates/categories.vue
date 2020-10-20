<template>
  <div class="sidebar sidebar_categorie">
  <div v-if="isCategorieLoaded">
    <h2>Catégories</h2>
    <list
      name="categorieshow"
     :items="categories"
     :path="currentPath"
     :selected="categorie"
     >
       <!-- @select="selectCat" -->
     </list>

  </div>
  <loader v-if="!isCategorieLoaded">
  </loader>
  </div>
</template>

<script>
  import list from '@/Modules/Lists/Templates/list'
  import loader from '@/Modules/Loader/Templates/loader'
  import { threadlist } from '/lib/recursiveArray'
  import { mapGetters } from 'vuex'

  export default ({
    name: 'categories',
    computed: {
      isCategorieLoaded () {
        return this.categories.length > 0
      },
      categories () {
        let cat = this.$store.getters['entities/categories/query']()
          .with('thumb')
          .where('online', v => v > 0)
          .get()
        // console.log)
        return threadlist(cat, 'parent_id', 'children')
      },
      currentPath () {
        return this.path(this.categorie)
      },
      ...mapGetters({
        // categories: 'onlineCategories',
        categorie: 'categorie',
        path: 'currentPath'
        // isCategorieLoaded: 'isCategorieLoaded'
      })
    },
    data () {
      return {
        // isLoaded: false,
        categoriesList: {}
      }
    },
    mounted () {
    },
    // computed: {
    //   categoriesList () {
    //     return this.categories
    //   }
    // },
    methods: {
      // ...mapActions({
      //   selectCategorie: 'selectCategorie'
      // })
      // selectCat () {
        // this.selectCategorie(this.$route.params.id)
      // }
    },
    components: {
      list,
      loader
    }
  })
</script>
