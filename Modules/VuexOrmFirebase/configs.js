import { Database } from '@vuex-orm/core'

export const firebaseConfig = {
  databases: [
    {
      apiKey: 'AIzaSyCaMybn3lV9jtFtMEEqiVfReMj8holjY7o',
      authDomain: 'lovel-cloud.firebaseapp.com',
      databaseURL: 'https://lovel-cloud.firebaseio.com',
      projectId: 'lovel-cloud',
      storageBucket: 'lovel-cloud.appspot.com',
      messagingSenderId: '480879385660'
    }
  ]
}
export const pluginConfig = {
  database: new Database(),
  firebase: firebaseConfig
}
