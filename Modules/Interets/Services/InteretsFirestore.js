// import createEasyFirestore from 'vuex-easy-firestore'

const userDataModule = {
  firestorePath: '/Interests/',
  firestoreRefType: 'collection', // or 'doc'
  moduleName: 'interestsData',
  statePropName: 'docs'
  // for more options see below
  // you can also add state/getters/mutations/actions
}

// do the magic 🧙🏻‍♂️
// const easyFirestore = createEasyFirestore(userDataModule)

export default userDataModule
