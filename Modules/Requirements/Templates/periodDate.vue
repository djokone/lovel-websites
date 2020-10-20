<template>
  <div>
    <br><h4>Créer un groupe intervalle de periode</h4>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="Label:">
        <el-input v-model="newPeriodDate.label"></el-input>
      </el-form-item><br>
      <el-form-item label="Inverser:">
        <el-switch v-model="newPeriodDate.isRequired"></el-switch>
      </el-form-item><br>
      <el-form-item label="Entre le:">
        <el-date-picker
          v-model="newPeriodDate.requirements[0].value"
          type="date"
          placeholder="début">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="et le:">
        <el-date-picker
          v-model="newPeriodDate.requirements[1].value"
          type="date"
          placeholder="fin">
        </el-date-picker>
      </el-form-item>
      <el-button @click="newChange" style="float: right;" type="primary">Ajouter le groupe logique</el-button>
      <el-button type="success" @click="saveChange" style="float: right;">Sauvegarder le groupe logique</el-button>
    </el-form>
  </div>
</template>

<script>
//   import moment from 'moment'
  export default {
    name: 'periodDate',
    data () {
      return {
        newPeriodDate: {
          label: '',
          isRequired: false,
          logicOperator: 'ET',
          logicGroups: [],
          requirements: [
            {
              value: '',
              type: 'DateTime',
              conditionnalOperator: '>=',
              valueToCompare: ''
            },
            {
              value: '',
              type: 'DateTime',
              conditionnalOperator: '<=',
              valueToCompare: ''
            }
          ]
        }
      }
    },
    methods: {
      newChange () {
        this.$emit('add', this.newPeriodDate)
      },
      saveChange () {
        this.$emit('save', this.newPeriodDate)
      }
    }
  }
</script>