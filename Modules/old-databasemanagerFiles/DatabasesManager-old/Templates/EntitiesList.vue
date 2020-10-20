<template>
  <el-table
    v-loading="isLoading"
    ref="EntitiesList"
    :max-height="maxHeight"
    :data="display"
    :empty-text="emptyText"
    @selection-change="onSelectionChange"
  >
    <el-table-column
      v-if="selectionMode"
      type="selection"
      width="50"
    >
    </el-table-column>
    <el-table-column v-if="hasExpand" type="expand">
      <template slot-scope="props">
        <slot name="expand" :table="props">
        </slot>
      </template>
    </el-table-column>
    <!--<span v-for="field in formatedFields">-->
    <el-table-column  v-for="(field, index) in formatedFields" :key="index" v-if="!hasParent(field)&&!isSlot(field)" :label="getText(field.name)" :prop="field.name">
    </el-table-column>
    <el-table-column v-else-if="isSlot(field)" :label="getText(field.name)">
      <span slot-scope="scope">
        <slot :name="field.name" :field="scope">
        </slot>
      </span>
    </el-table-column>
    <el-table-column v-else-if="hasParent" :label="field.name">
      <span slot-scope="scope" v-if="scope.row[field.name] && scope.row[field.name].name">
        {{scope.row[field.name].name}}
      </span>
    </el-table-column>
    <el-table-column
      v-if="hasActions"
      fixed="right"
      :label="getText('action')"
    >
      <span slot-scope="scope">
        <el-button
          v-for="(action, index) in actionsCols"
          :key="index"
          :icon="action.icon"
          :type="action.type || 'primary'"
          :circle="action.circle || true"
          @click="onActionClick(action, scope.row)"
        ></el-button>
      </span>

    </el-table-column>
    <!--</span>-->
  </el-table>
</template>

<script>
  // import ModelBehavior from '../Mixins/ModelBehavior'
  import DatabasesBehavior from '../Mixins/DatabasesBehavior'
  import SchemaBehavior from '../Mixins/SchemaBehavior'
  import SelectableList from '../Mixins/SelectableList'
  import LoadingBehavior from '../Mixins/LoadingBehavior'
  import pluralize from 'pluralize'
  import { Ucfirst } from '@/libs/textUtils'

  /**
   *  Usage :
   * ``` html
   *  <entities-list
         :model="Model"
         max-height="625"
         :selectionMode="isSelectionMode"
         :ignoredFields="['required', 'tags', 'interests', 'description']"
         :FieldsSlots="['required']"
         :textLabels="textLabels"
         :data="results"
         :isLoading="isLoading"
         v-on:changeSelection="onChangeSelection">
     <template slot="expand" slot-scope="props">
     <el-row :gutter="20">
     <el-col :span="12">
     <p style="text-align: left;">
     Règle du défi : <br>
     {{props.table.row.description}}
     </p>
     </el-col>
     <el-col :span="12" v-if="props.table.row.interests.length > 0">
     <p  style="text-align: left;">
     Centres d'intérets : <br>
     </p>
     <p style="text-align: left;">
     <el-tag v-for="interest in props.table.row.interests">
     {{interest.name}}
     </el-tag>
     </p>
     </el-col>
     </el-row>
     </template>
     <template slot="required" slot-scope="item">
     <!--{{item.field.row}}-->
     </template>
   </entities-list>
   * ```
   */
  export default {
    name: 'entities-list',
    mixins: [DatabasesBehavior, SchemaBehavior, SelectableList, LoadingBehavior],
    data () {
      return {
        actionsCols: []
      }
    },
    props: {
      additionalColumns: {
        type: [Array],
        default () {
          return []
        }
      },
      maxHeight: {
        type: [String, Number],
        default: null
      },
      textLabels: {
        type: [Object],
        default () {
          return {
            action: 'Opérations'
          }
        }
      },
      deleteAction: {
        type: [String],
        default: 'firestoreDeleteEntity'
      },
      actions: {
        type: [Array],
        default () {
          return [
            {
              action: 'edit',
              type: 'primary',
              actionType: 'link',
              icon: 'el-icon-edit',
              name: false,
              params (item) {
                console.log(item)
                return {
                  id: item.id
                }
              }
            },
            {
              action: 'delete',
              type: 'danger',
              name: 'delete',
              actionType: 'function',
              icon: 'el-icon-delete',
              callback (item) {
                console.log(item)
              }
            }
          ]
        }
      },
      FieldsSlots: {
        type: [Array],
        default () {
          return []
        }
      },
      data: {
        default: false,
        type: [Array, Boolean]
      },
      ignoredFields: {
        default () {
          return []
        },
        type: [Array]
      }
    },
    created () {
      console.log('Entities list created')
      this.initEntitiesList()
    },
    computed: {
      console () {
        return console
      },
      hasActions () {
        return this.actions.length
      },
      hasExpand () {
        return this.$scopedSlots.expand
      },
      getSlots () {
        let slots = []
        for (let slot in this.$scopedSlots) {
          if (slot !== 'default') {
            slots.push(slot)
          }
        }
        return slots
      },
      display () {
        if (!this.data) {
          return []
        } else {
          return this.data
        }
      },
      emptyText () {
        return 'Aucun ' + this.getText(this.Collection) + ' n\'a été trouvé !'
      },
      formatedFields () {
        let formatFields = this.FieldsWithoutForeignKey
        if (this.ignoredFields.length) {
          formatFields = this.FieldsWithoutForeignKey.filter(v => {
            return !this.ignoredFields.includes(v.name)
          })
        }
        if (this.additionalColumns.length > 0) {
          formatFields = [...formatFields, ...this.additionalColumns.map(v => {
            return {name: v}
          })]
        }
        return formatFields
      }
    },
    methods: {
      initEntitiesList () {
        this.syncActions()
        this.formatDefaultActionsNames()
      },
      formatDefaultActionsNames () {
        let i = 0
        this.actionsCols.forEach(v => {
          if (v.action === 'edit' && v.name === false) {
            this.actionsCols[i].name = 'admin' + Ucfirst(pluralize.singular(this.Collection)) + 'Edit'
          }
          i++
        })
      },
      syncActions () {
        let that = this
        this.actions.forEach(v => {
          that.actionsCols.push(v)
        })
        // this.actionsCols = this.actions
      },
      onActionClick (action, row) {
        if (action.actionType === 'link') {
          let params
          if (typeof action.params === 'function') {
            params = action.params(row)
          } else if (action.params) {
            params = action.params
          }
          this.$router.push({name: action.name, params})
        } else {
          if (typeof this.callback === 'function') {
            this.callback(row, action)
          } else if (typeof this[action.name] === 'function') {
            this[action.name](row)
          }
        }
      },
      getText (key) {
        if (this.textLabels && this.textLabels[key]) {
          return this.textLabels[key]
        } else {
          return key
        }
      },
      isSlot (field) {
        return this.getSlots.includes(field.name)
      },
      delete (row) {
        let that = this
        this.$confirm(
          'Etes vous sûr de vouloir supprimer ' + row.name + ' des ' + pluralize.plural(this.getText(this.Collection).toLowerCase()) + ' de l\'application ?',
          'Confirmer la suppression', {
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler'
          })
          .then(() => {
            this.$store.dispatch(this.deleteAction, {
              id: row.id,
              entity: this.Model,
              verbose: this.debug
            })
              .then(() => {
                that.$notify({
                  title: 'Succès',
                  type: 'success',
                  message: row.displayName + ' à bien été supprimé des ' + pluralize.plural(this.getText(this.Collection).toLowerCase())
                })
              })
              .catch((e) => {
                that.$notify({
                  title: 'Erreur de suppression',
                  message: 'Un problème est survenu lors de la suppression du ' + pluralize.plural(this.getText(this.Collection).toLowerCase()) + ' ' + row.name,
                  type: 'error'
                })
                throw new Error(e)
              })
          })
      }
    }
  }
</script>

<style scoped>

</style>
