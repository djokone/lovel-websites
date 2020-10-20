// import firebase from 'firebase/app'
// import 'firebase/firestore'
// import 'firebase/auth'

import DatabaseManager from '@/Modules/DatabasesManager/DatabaseManager'
let firebase = require('firebase/app')
require('firebase/firestore')
require('firebase/auth')
DatabaseManager.initLogger(console)
DatabaseManager.initSDK(firebase)
DatabaseManager.addDatabase({
  apiKey: 'AIzaSyCaMybn3lV9jtFtMEEqiVfReMj8holjY7o',
  authDomain: 'lovel-cloud.firebaseapp.com',
  databaseURL: 'https://lovel-cloud.firebaseio.com',
  projectId: 'lovel-cloud',
  storageBucket: 'lovel-cloud.appspot.com',
  messagingSenderId: '480879385660'
}, {
  defaultDatabase: true
})
DatabaseManager.addDatabase({
  apiKey: 'AIzaSyAjTEQgDNLV6Dp5LhQzSg8pm4HUjYlACdE',
  authDomain: 'lovel-sauvegarde.firebaseapp.com',
  databaseURL: 'https://lovel-sauvegarde.firebaseio.com',
  projectId: 'lovel-sauvegarde',
  storageBucket: 'lovel-sauvegarde.appspot.com',
  messagingSenderId: '25831336337'
})
DatabaseManager.addDatabase({
  apiKey: 'AIzaSyDfi8bSwJAYbK1bHIgZZ2c7DRMBwBqwkvI',
  authDomain: 'lovel-3442f.firebaseapp.com',
  databaseURL: 'https://lovel-3442f.firebaseio.com',
  projectId: 'lovel-3442f',
  storageBucket: 'lovel-3442f.appspot.com',
  messagingSenderId: '27044495149'
})
DatabaseManager.initialize({})

// const config = {
//   apiKey: 'AIzaSyCaMybn3lV9jtFtMEEqiVfReMj8holjY7o',
//   authDomain: 'lovel-cloud.firebaseapp.com',
//   databaseURL: 'https://lovel-cloud.firebaseio.com',
//   projectId: 'lovel-cloud',
//   storageBucket: 'lovel-cloud.appspot.com',
//   messagingSenderId: '480879385660'
// }

// export const firebaseLovelCloud = firebase.initializeApp(config)

// firebaseLovelCloud.settings(settings)
console.log(DatabaseManager.firestore)
export const db = DatabaseManager.firestore

export const auth = DatabaseManager.auth
// export default {
//   firebaseLovelCloud: firebaseLovelCloud,
//   auth
// }

// export default function () {
//   return firebase.initializeApp(config)
// }
