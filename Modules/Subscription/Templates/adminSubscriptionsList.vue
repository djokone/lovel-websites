<template>
    <div class="subscriptionList">
      <h3 class="small-title">Liste de nos <strong>{{paginator.count}}</strong> pré-inscris</h3>
      <form class="filter" @change="changeFilter">
        <label for="limit">Item par List : </label>
        <select v-model="localPaginator.limit" name="limit" id="limit">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="80">80</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
        </select>
      </form>
      <div>
        <h3></h3>
      </div>
      <el-table
        :data="adminSubscriptionsList"
        v-loading="false"
        empty-text="Aucun centre challenge n'a été trouvé !"
      >
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="Email" prop="mail">
        </el-table-column>
        <el-table-column label="Pré-inscris depuis">
          <span slot-scope="scope">
            {{transformDate(scope.row.created)}}
          </span>
        </el-table-column>
        <el-table-column label="Opérations" fixed="right">
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import moment from 'moment'
  moment.locale('fr')

  /**
   * Import Personal Components
   */
  import helperTable from '@/Modules/Elements/Templates/helperTables'
  import Paginator from '@/Modules/Elements/Templates/helperPaginator'

  const defaultOptions = {
    total: false,
    defaultCurrentPage: 1,
    limit: 100,
    page: 1
  }

  export default {
    name: 'subscription-list',
    props: {
      all: {
        default: false
      },
      paginator: {
        default () {
          return defaultOptions
        }
      }
    },
    data () {
      return {
        localPagination: {
        },
        localPaginator: {
          limit: 30
        },
        default: {
          paginator: {
            currentPage: 1
          }
        },
        columns: [
          {
            title: 'ID',
            name: 'id'
          },
          {
            title: 'Email',
            name: 'mail'
          },
          {
            title: 'Inscrit depuis',
            name: 'created',
            order: true,
            type: 'slot'
          },
          {
            title: 'Actions',
            name: 'actions',
            type: 'slot'
          }
        ]
      }
    },
    computed: {
      mergedPaginator () {
        return {
          ...defaultOptions, ...this.paginator, ...this.localPaginator
        }
      },
      SubscribeTotal () {
        return this.adminSubscriptionsList.length
      },
      query () {
        return this.$store.getters['entities/subscriptions/query']()
      },
      subscriptionsListPaginate () {
        let query = this.query
        // if ()
        if (this.mergedPaginator.limit) {
          query.limit(this.mergedPaginator.limit)
        }
        return query.get()
      },
      currentPage () {
        return this.paginator.currentPage ? this.paginator.currentPage : this.default.paginator.currentPage
      },
      adminSubscriptionsList () {
        return this.query.get()
      }
    },
    methods: {
      ...mapActions(['InsertSubscriptions']),
      changeFilter () {
        this.InsertSubscriptions(this.localPaginator).then((res) => {
          this.localPagination = res.data.pagination
        })
      },
      queryRedirect (query) {
        console.log(this.$route)
        this.$router.push({query})
      },
      transformDate (date) {
        if (typeof date !== undefined) {
          // let now = moment(date).fromNow()
          let now = moment(date).format('LL')
          return now
        }
      }
    },
    components: {
      helperTable,
      Paginator
    }
  }
</script>

<style scoped>

</style>
