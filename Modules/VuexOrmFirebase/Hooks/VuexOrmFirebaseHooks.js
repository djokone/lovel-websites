import { Model } from '@vuex-orm/core'
// import { db } from './firebaseLovelCloud'
// import { getData } from '@/libs/FirebaseUtils'

class FirebaseVuexOrmHooks {
  constructor (components, options) {
    this.hooks = []
    this.Query = components.Query
    console.log(components)
    this.Options = options
    this.initHooks()
  }
  connect (hook) {
    this.hooks[hook] = this.Query.on(hook, this[hook + 'Callback'])
  }
  install () {
  }
  initHooks () {
    console.log('init hooks')
    this.connect('beforeSelect')
    this.connect('afterWhere')
    this.connect('afterOrderBy')
    this.connect('afterLimit')
    this.connect('beforeCreate')
    this.connect('afterCreate')
    this.connect('beforeUpdate')
    this.connect('afterUpdate')
    this.connect('beforeDelete')
    this.connect('afterDelete')
  }
  beforeSelectCallback (records, entity) {
    let currentEntity = Model.database().entities.find((v) => v.name === entity)
    console.log('Before Select : ' + entity)
    // If is new process
    if (!this.model.isLoaded) {
      this.model.nbLoaded = 0
      this.model.isLoaded = false
      // this.model.create()
    }
    this.model.nbLoaded ++
    console.log('first', !this.model.isLoaded)
    console.log(this.model.nbLoaded)
    if (this.model.firebase) {
      this.model.dispatch('getCollection', {})
      console.log(Model.database().entities)
      console.log(currentEntity)
      // if (!this.isLoaded) {
      //   console.log('before Process Firebase when is first')
      //   let entityCollection = db.collection(entity).get().then((res) => {
      //     let allData = getData(res).then((data) => {
      //       return data
      //     })
      //     console.log(res)
      //     console.log(allData)
      //   })
      //   console.log(entityCollection)
      // }
    }
    // console.log(records)
    // console.log(entity)
    // console.log(Model.database())
    // throw new Error('Obligatoire')
    return records
  }
  afterWhereCallback (records, entity) {
    console.log('afterWhere')
    // console.log(records)
    // console.log(entity)
    // console.log(Model.database())
    // throw new Error('Obligatoire')
    return records
  }
  // beforeSelectCallback (records, entity) {
  //   console.log('beforeSelect')
  //   // console.log(records)
  //   // console.log(entity)
  //   console.log(Model.database())
  //   // throw new Error('Obligatoire')
  //   return records
  // }
  afterOrderByCallback (records, entity) {
    console.log('afterOrderBy')
    // console.log(records)
    // console.log(entity)
    // console.log(Model.database())
    // throw new Error('Obligatoire')
    return records
  }
  afterLimitCallback (records, entity) {
    console.log('afterLimit')
    // console.log(records)
    // console.log(entity)
    // console.log(Model.database())
    // throw new Error('Obligatoire')
    return records
  }
  beforeCreateCallback (records, entity) {
    console.log('beforeCreate')
    // console.log(records)
    // console.log(entity)
    // console.log(Model.database())
    // throw new Error('Obligatoire')
    return records
  }
  afterCreateCallback (records, entity) {
    console.log('after create')
    this.model.isLoaded = true
  }
  beforeUpdateCallback (records, entity) {
    console.log('beforeUpdate')
    // console.log(records)
    // console.log(entity)
    // console.log(Model.database())
    // throw new Error('Obligatoire')
    return records
  }
  afterUpdateCallback (records, entity) {
    console.log('afterUpdate')
    // console.log(records)
    // console.log(entity)
    // console.log(Model.database())
    // throw new Error('Obligatoire')
    return records
  }
  beforeDeleteCallback (records, entity) {
    console.log('beforeDelete')
    // console.log(records)
    // console.log(entity)
    // console.log(Model.database())
    // throw new Error('Obligatoire')
    return records
  }
  afterDeleteCallback (records, entity) {
    console.log('afterDelete')
    // console.log(records)
    // console.log(entity)
    // console.log(Model.database())
    // throw new Error('Obligatoire')
    return records
  }
}

export default FirebaseVuexOrmHooks
