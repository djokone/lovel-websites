import Vue from 'Vue'
import databases from '@/Modules/DatabaseManager/DatabaseManager'
export const database = new Vue({
  data: {
    currentId: databases.currentId
  }
})
