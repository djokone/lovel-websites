<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index" :class="column.colClass || column.name" @click="changeToogleOrder(column)">
            {{column.title || column.name}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in dataOrdered" :key="key">
          <td v-for="column in columns" :class="column.class || ''">
            <span v-if="column.type && column.type === 'slot'">
              <slot :name='column.name' :item="findItem(item)">
              </slot>
            </span>
            <span v-else>
              {{getValue(item, column)}}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { orderBy, isEmpty } from 'lodash'
  export default ({
    name: 'HelperTables',
    data () {
      return {
        localData: {},
        localOrderBy: this.orderBy,
        localOrderType: this.orderType
      }
    },
    props: {
      primaryKey: {
        default: 'id'
      },
      defaultName: {
        type: [String],
        default: 'name'
      },
      order: {
        type: [Boolean],
        default: true
      },
      orderBy: {
        default: 'id'
      },
      orderType: {
        default: 'desc'
      },
      columns: {
        type: [Array],
        default () {
          return [
            {
              title: 'ID',
              name: 'id'
            },
            {
              title: 'Nom',
              name: this.defaultName
            },
            {
              title: 'Action',
              name: 'action',
              type: 'slot'
            }
          ]
        }
      },
      span: {
        type: [Number]
      },
      data: {
        type: [Object, Array],
        default () {
          return {
          }
        }
      }
    },
    methods: {
      findItem (item) {
        return this.data.find((v) => {
          return v[this.primaryKey] === item[this.primaryKey]
        })
      },
      getValue (item, column) {
        if (!column.type) {
          return item[column.name]
        } else if (column.type === 'slot') {
        }
      },
      changeToogleOrder (column) {
        if (!column.type || column.order) {
          if (this.localOrderBy !== column.name) {
            this.localOrderType = 'asc'
            this.localOrderBy = column.name
          } else {
            this.localOrderType = this.localOrderType === 'desc' ? 'asc' : 'desc'
          }
        }
      }
    },
    computed: {
      dataOrdered () {
        if (this.order) {
          return orderBy(this.dataTable, this.localOrderBy, this.localOrderType)
        } else {
          return this.dataTable
        }
      },
      dataTable: {
        get () {
          let dataTable = []
          if (!isEmpty(this.data)) {
            this.data.forEach((v, k) => {
              let data = {}
              this.columns.forEach((col, span) => {
                if (typeof v[col.name] !== 'undefined') {
                  if (typeof col.value === 'function') {
                    data[col.name] = col.value(v)
                  } else {
                    data[col.name] = v[col.name]
                  }
                } else {
                  if (typeof col.value === 'function') {
                    data[col.name] = col.value(v)
                  } else if (col.type !== 'slot') {
                    console.warn('The ' + col.name + ' key doesn\'t exist in data props, create a value function to the column with ' + col.name + ' name or choose ')
                  }
                }
              })
              dataTable[k] = data
            })
          }
          return dataTable
        }
      }
    }
    // watch: {
    //   data: {
    //     deep: true,
    //     handler (val) {
    //       console.log(val)
    //     }
    //   }
    // }
  })
</script>
