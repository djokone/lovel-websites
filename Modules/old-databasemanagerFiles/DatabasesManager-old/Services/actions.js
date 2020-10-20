import Database from '../DatabaseManager'
import {
  getData
} from '../libs/FirebaseUtils'
// import { DatabaseManager } from '..'

export function adminChangeCurrentDatabase ({
  commit
}, newVal) {
  Database.changeCurrentId(newVal)
  commit('changeCurrentDatabase', newVal)
}
export function adminToogleDebug ({
  commit
}, newVal) {
  commit('toogleDebug')
}
function booleanOperation (value, operator, valueToCompare) {
  let operation
  if (operator === '==') {
    operation = value === valueToCompare
  }
  if (operator === '<=') {
    operation = value <= valueToCompare
  }
  if (operator === '>=') {
    operation = value >= valueToCompare
  }
  if (operator === 'array-contains' && Array.isArray(value)) {
    operation = value.includes(valueToCompare)
  }
  // console.log(value + operator + valueToCompare)
  // console.log(operation)
  return operation
  // if (operator === 'array-contains-any' && Array.isArray(value)) {
  //   operation = value.includes(valueToCompare)
  // }
}
function CreateLocalWhere (data, condition) {
  // console.log(data)
  // console.log(condition)
  if (typeof data[condition[0]] !== 'undefined') {
    let value = data[condition[0]]
    return booleanOperation(value, condition[1], condition[2])
  }
}

// const Logger = Database.Logger

/**
 * Vuex store object
 * @typedef {Object} VuexStore
 * @property {boolean|Object} dispatch - Vuex dispatch function
 * @property {boolean|string} getters - Vuex getters
 */

/**
 *
 * Settings to load a single entity
 *
 * @typedef {Object} LoadEntitySettings
 * @property {string} id - Id of the entity you want to load in Firestore
 * @property {EntityModel} entity - Inject the vuexOrm Model that you want to use for this action
 * @property {string} collection - The name of the employee.
 * @property {Boolean} verbose - Active verbose in the shell.
 * @property {boolean} lasyLoad - Don't load data again if the entity allready exist in the local database
 * @property {Object=} data - Data to add additional of Firestore data to the local database
 * @property {Object} watch - Does it watch the loaded entity to Firestore futur updates
 * @property {string} [primaryKey = 'entity.primaryKey'] - The primary key name field, by default it taking EntityModel Primary key.
 * @property {string} [FirestoreId = 'Database.currentId'] - The id of the Firestore database where you want to get the data, by default it's the current database configured by DatabaseManage class initialisation
 *
 */

/**
 *
 * Response returning by the loading entity
 *
 * @typedef {Object} LoadEntityResponse
 * @property {object} data - Data who's been loaded
 * @property {boolean} exists - Doe's the entity exists in Firestore database
 * @property {string} localUpdate - Doe's the local database has been updated localy.
 * @property {Boolean} firestoreLoad - Has called firestore, usefull to know if the load has been realy lasilly.
 * @property {Array.<DocumentSnapshot>} watched - All the entity who's been watched during the loading
 *
 */

/**
 *
 * Get a document in Firestore spécific collection to add or update it as an entity to VuexOrm in the selected database
 *
 * @param {VuexStore} store - Automatically filled when this action is called by vuex dispatch function
 * @param {LoadEntitySettings} settings - Look at LoadEntitySettings belows
 * @returns {LoadEntityResponse} - Return what has been done durring the loading process
 * Promise < firebase.firestore.DocumentSnapshot >
 */
let loadingIds = {}

export async function firestoreLoadEntity ({
  dispatch,
  getters
}, {
  id = false,
  entity,
  collection = true,
  verbose = false,
  lasyLoad = true,
  data = {},
  primaryKey = entity.primaryKey,
  FirestoreId = Database.currentId,
  watch = false,
  EntitiesCollections = false
}) {
  if (collection === true) {
    collection = entity.entity
  }
  if (EntitiesCollections === false) {
    EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
  }
  let watched = []
  let entities = false
  let exists = true
  let localUpdate = false
  let firestoreLoad = false
  // let queryPath = FirestoreId + '/' + collection + '/query'
  // let existent = getters[queryPath]().where(primaryKey, id).get()
  // Database.Logger.log(hasToLoad)
  if (!loadingIds[FirestoreId]) {
    loadingIds[FirestoreId] = {}
  }
  if (!loadingIds[FirestoreId][collection]) {
    loadingIds[FirestoreId][collection] = []
  }
  let allReadyLoaded = loadingIds[FirestoreId][collection].includes(id)
  if (lasyLoad && !allReadyLoaded) {
    loadingIds[FirestoreId][collection].push(id)
  }
  if (verbose) {
    Database.Logger.log('Start loading one entity in ' + collection + ' collection ' + FirestoreId + ' database')
    Database.Logger.log(entity.primaryKey + ' : ', id)
    Database.Logger.log('Is all ready loaded all : ', entity.databases[FirestoreId].allLoaded)
    Database.Logger.log('Lasy load : ', lasyLoad)
    Database.Logger.log('Allready loaded :', allReadyLoaded)
    Database.Logger.log('Watch : ', watch)
  }
  if (!lasyLoad || (lasyLoad && !allReadyLoaded)) {
    EntitiesCollections = EntitiesCollections.doc(id)
    Database.Logger.log(watch)
    if (watch) {
      if (verbose) {
        Database.Logger.log('START WATCHING -------------------------------------')
        Database.Logger.log('Collection:' + collection + ' - Doc: ' + id + '-----------------------')
      }
      let watchSettings = {
        sync: true,
        ...watch
      }
      let watchEntity = await dispatch('firestoreWatchEntity', {
        verbose,
        document: EntitiesCollections,
        entity,
        collection,
        FirestoreId,
        ...watchSettings
      })
      watched.push(watchEntity)
    }
    if (verbose) {
      Database.Logger.log('Collection : ' + collection + ' - ' + id)
    }
    entities = await EntitiesCollections.get()
    firestoreLoad = true
    if (entities) {
      data = {
        ...data,
        ...entities.data()
      }
    }
    data[primaryKey] = id
    // update local database
    await dispatch(FirestoreId + '/' + collection + '/insertOrUpdate', {
      data
    })
    localUpdate = true
  }
  if (entities) {
    exists = entities.exists
  }
  if (verbose) {
    Database.Logger.log('Finish loading ' + collection + ' entity in ' + FirestoreId + ' database')
    Database.Logger.log(entity.primaryKey + ' : ', id)
    Database.Logger.log('')
    Database.Logger.log('Return :')
    Database.Logger.log('data :', data)
    Database.Logger.log('Allready loaded :', allReadyLoaded)
    Database.Logger.log('exists :', exists)
    // Database.Logger.log('Has been updated localy :', localUpdate)
    Database.Logger.log('Firestore Loaded :', firestoreLoad)
    // Database.Logger.log('Link entity :', firestoreLoad)
    Database.Logger.log('------------------------------------------------------')
  }
  return {
    data,
    exists,
    localUpdate,
    firestoreLoad,
    watched
  }
}

/**
 *
 * Settings to watch a firestore document
 *
 * @typedef {Object} WatchEntitySettings
 * @property {Boolean} verbose - Active verbose in the shell.
 * @property {EntityModel} entity - Inject the vuexOrm Model that you want to use for this action
 * @property {string} document - Document to operate on.
 * @property {string} collection - Name of the used collection.
 * @property {boolean} sync - Automatically update local database after Firestore changes.
 * @property {onDocumentSnapshot} onSnapshot - Data to add additional of Firestore data to the local database
 * @property {string} [FirestoreId = 'Database.currentId'] - The id of the Firestore database where you want to get the data, by default it's the current database configured by DatabaseManage class initialisation
 *
 *
 * Callback triggered when a watched document has been change
 *
 * @callback onDocumentSnapshot
 * @param {FirestoreDocumentSnapshot} Snapshot - Get the document firestore snapshot
 * @param {EditEntityResponse} responseMessage - Get the response of the sync edition
 *
 */

/**
 *
 * Watch a specific document changes that can update local database
 *
 * @param {VuexStore} store - Automatically filled when this action is called by vuex dispatch function
 * @param {WatchEntitySettings} settings - Look at LoadEntitySettings
 * @returns {Watcher} - Return the watcher activated to be able to stop it if it's necessary
 *
 */
export async function firestoreWatchEntity ({
  dispatch
}, {
  document,
  entity,
  sync = true,
  onSnapshot = false,
  collection = entity.entity,
  FirestoreId = Database.currentId,
  verbose = true
}) {
  let watcher = document.onSnapshot(async (snapshot) => {
    if (verbose) {
      Database.Logger.log('Change detected in ' + collection + ' on ' + FirestoreId + ' database')
      Database.Logger.log('On document : ' + snapshot.id)
      Database.Logger.log('Sync : ' + sync)
      Database.Logger.log('----------------------------------START-CHANGE-PROCESS')
    }
    let editedEntity = false
    if (sync) {
      // sync localy
      editedEntity = await dispatch('firestoreEditEntity', {
        verbose,
        entity,
        id: snapshot.id,
        data: snapshot.data(),
        FirestoreId,
        saveInDatabase: false
      })
    }
    if (typeof onSnapshot === 'function') {
      // exec callback
      onSnapshot(snapshot, editedEntity)
    }
  }, (error) => {
    if (verbose) {
      Database.Logger.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      Database.Logger.log('Error detected in ' + collection + ' on ' + FirestoreId + ' database')
      Database.Logger.log('On document : ' + snapshot.id)
      Database.Logger.log('Sync : ' + sync)
      Database.Logger.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      Database.Logger.error(error)
      Database.Logger.log('-------------------------------------------------STOP-CHANGE-PROCESS')
    }
  })
  return watcher
}

/**
 *
 * Settings to watch a firestore collection
 *
 * @typedef {Object} WatchEntitySettings
 * @property {Boolean} verbose - Active verbose in the shell.
 * @property {EntityModel} entity - Inject the vuexOrm Model that you want to use for this action
 * @property {string} document - Document to operate on.
 * @property {string} collection - Name of the used collection.
 * @property {boolean} sync - Automatically update local database after Firestore changes.
 * @property {onDocumentSnapshot} onSnapshot - Data to add additional of Firestore data to the local database
 * @property {string} [FirestoreId = 'Database.currentId'] - The id of the Firestore database where you want to get the data, by default it's the current database configured by DatabaseManage class initialisation
 *
 *
 * Callback triggered when a watched document has been change
 *
 * @callback onDocumentSnapshot
 * @param {FirestoreDocumentSnapshot} Snapshot - Get the document firestore snapshot
 * @param {EditEntityResponse} responseMessage - Get the response of the sync edition
 *
 */

/**
 *
 * Watch a specific document changes that can update local database
 *
 * @param {VuexStore} store - Automatically filled when this action is called by vuex dispatch function
 * @param {WatchEntitySettings} settings - Look at LoadEntitySettings
 * @returns {Watcher} - Return the watcher activated to be able to stop it if it's necessary
 *
 */
export async function firestoreWatchEntities ({
  dispatch
}, {
  collection,
  entity,
  sync = ['modified', 'added', 'removed'],
  onDocChange = false,
  collectionName = entity.entity,
  FirestoreId = Database.currentId,
  verbose = true
}) {
  if (verbose) {
    Database.Logger.log('Start sync ')
  }
  let watcher = collection.onSnapshot(async (snapshot) => {
    if (verbose) {
      Database.Logger.log('Change detected in ' + collectionName + ' on ' + FirestoreId + ' database')
      Database.Logger.log('Sync : ' + sync)
      Database.Logger.log('Snapshot : ' + typeof onDocChange)
      Database.Logger.log('----------------------------------START-WATCHING-PROCESS')
    }
    // let editedEntity = false
    if (sync) {
      await snapshot.docChanges().forEach(async (change) => {
        let AllowedToSync = sync.includes(change.type)
        if (verbose) {
          // Database.Logger.log('----------------------------------CHANGE-DETECT-PROCESS')
          Database.Logger.log('Change detected in ' + collectionName + ' on ' + FirestoreId + ' database')
          Database.Logger.log('On document : ' + change.doc.id)
          Database.Logger.log('Type :', change.type)
          Database.Logger.log('Sync : ' + sync)
          Database.Logger.log('Snapshot : ' + typeof onDocChange)
          Database.Logger.log('async : ' + typeof onDocChange.then === 'function')
          Database.Logger.log(onDocChange.constructor.name)
          // Database.Logger.log(onDocChange instanceof Promise)
          Database.Logger.log('Allowed to sync : ' + AllowedToSync)
          Database.Logger.log('END----------------------------------------------------')
        }
        let data = change.doc.data()

        if (AllowedToSync) {
          let syncActions = {
            added: 'firestoreEditEntity',
            modified: 'firestoreEditEntity',
            removed: 'firestoreDeleteEntity'
          }
          // onSnapshot()
          if (change.type === 'added' || change.type === 'modified') {
            // sync localy
            Database.Logger.log('EDIT----------------------------------------------------')
            try {
              await dispatch(syncActions[change.type], {
                verbose,
                entity,
                id: change.doc.id,
                data,
                FirestoreId,
                saveInDatabase: false
              })
            } catch (e) {
              Database.Logger.log('FINISH-DELETE-WITH-ERROR--------------------------------------------------')
              Database.Logger.error(e)
              throw e
            }
          } else if (change.type === 'removed') {
            Database.Logger.log('DELETE----------------------------------------------------')
            try {
              await dispatch(syncActions[change.type], {
                verbose,
                entity,
                id: change.doc.id,
                FirestoreId,
                Firestore: false
              })
            } catch (e) {
              Database.Logger.log('FINISH-DELETE-WITH-ERROR--------------------------------------------------')
              Database.Logger.error(e)
              throw e
            }
          }
        }
        try {
          if (typeof onDocChange === 'function') {
            await onDocChange(change, data, snapshot)
          }
        } catch (e) {
          Database.Logger.error(e)
          Database.Logger.trace(e)
          throw e
        }
      })
    }
  }, (error) => {
    if (verbose) {
      Database.Logger.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      Database.Logger.log('Error detected in ' + collectionName + ' on ' + FirestoreId + ' database')
      Database.Logger.log('Sync : ' + sync)
      Database.Logger.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      Database.Logger.error(error)
      Database.Logger.log('-------------------------------------------------STOP-CHANGE-PROCESS')
    }
  })
  return watcher
}

/**
 *
 * Settings to load a single entity
 *
 * @typedef {Object} LoadEntitySettings
 * @property {EntityModel} entity - Inject the vuexOrm Model that you want to use for this action
 * @property {string} collection - The name of the employee.
 * @property {Boolean} verbose - Active verbose in the shell.
 * @property {boolean} lasyLoad - Don't load data again if the entity allready exist in the local database
 * @property {Object=} firestore - Data to add additional of Firestore data to the local database
 * @property {Object} limit - Does it watch the loaded entity to Firestore futur updates
 * @property {Object} startAfter - Does it watch the loaded entity to Firestore futur updates
 * @property {Object} VuexOrmAction - Does it watch the loaded entity to Firestore futur updates
 * @property {Object} watch - Does it watch the loaded entity to Firestore futur updates
 * @property {string} [primaryKey = 'entity.primaryKey'] - The primary key name field, by default it taking EntityModel Primary key.
 * @property {string} [FirestoreId = 'Database.currentId'] - The id of the Firestore database where you want to get the data, by default it's the current database configured by DatabaseManage class initialisation
 *
 */

/**
 *
 * Response returning by the loading entity
 *
 * @typedef {Object} LoadEntityResponse
 * @property {object} data - Data who's been loaded
 * @property {boolean} exists - Doe's the entity exists in Firestore database
 * @property {string} localUpdate - Doe's the local database has been updated localy.
 * @property {Boolean} firestoreLoad - Has called firestore, usefull to know if the load has been realy lasilly.
 * @property {Array.<DocumentSnapshot>} watched - All the entity who's been watched during the loading
 *
 */
export async function firestoreLoadEntities ({
  dispatch,
  getters
}, {
  entity = false,
  collection = true,
  verbose = false,
  lasyLoad = true,
  firestore = true,
  orderBy = false,
  limit = false,
  startAfter = false,
  onDocChange = false,
  sync = false,
  VuexOrmAction = 'insertOrUpdate',
  EntitiesCollections = false,
  where = [],
  FirestoreId = Database.currentId
}) {
  try {
    if (collection === true) {
      collection = entity.entity
    }
    if (EntitiesCollections === false) {
      EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
    }
    let primaryKey = entity.primaryKey
    entity.isFetch = true
    // let error
    let syncObserver
    let response = false
    let entities = false
    let firestoreLoaded = false
    let localDatabase
    let queryPath = FirestoreId + '/' + collection + '/query'
    let isWhere = Array.isArray(where) && where.length > 0
    let hasToLoadAll = !isWhere && ((lasyLoad && !entity.databases[FirestoreId].allLoaded) || !lasyLoad)
    if (verbose) {
      Database.Logger.log('Start loading ' + collection + ' in ' + FirestoreId + ' database')
      Database.Logger.log('Has a where request : ', isWhere)
      if (isWhere) {
        Database.Logger.log('@todo : ')
      }
      Database.Logger.log('Has to load all entities : ', hasToLoadAll)
      Database.Logger.log('Is all ready loaded all : ', entity.databases[FirestoreId].allLoaded)
      Database.Logger.log('Lasy load : ', lasyLoad)
      Database.Logger.log('------------------------------------------------------')
      Database.Logger.log('queryPath : ', queryPath)
      Database.Logger.log('Sync : ', sync)
      Database.Logger.log('Order By : ', orderBy)
      Database.Logger.log('------------------------------------------------------')
    }
    //
    // Load All the database
    // @todo : need to put that down
    //
    if (hasToLoadAll) {
      entities = await getData(await EntitiesCollections.get())
      firestoreLoaded = true
      entities.forEach(async (entity) => {
        try {
          await dispatch(FirestoreId + '/' + collection + '/' + VuexOrmAction, {
            data: [entity]
          })
        } catch (e) {
          Database.Logger.error(e)
          Database.Logger.error('Problem with ' + entity.uid || entity.id + ' for ' + collection)
        }
      })
      entity.databases[FirestoreId].allLoaded = true
    }
    //
    // Handle where parametre
    let CollectionReq = false
    let localData = getters[queryPath]()
    if (isWhere) {
      where.forEach((v) => {
        if (verbose) {
          Database.Logger.log('------------------------')
          Database.Logger.log('Where :')
          Database.Logger.log(v)
        }
        if (typeof v === 'function') {
          Database.Logger.log('@todo : Add function type for where in the local store for adminFirebaseLoadEntities')
        } else if (Array.isArray(v) && v.length === 3) {
          localData = localData.where((entry) => { return CreateLocalWhere(entry, v) }) //
          if (!CollectionReq) {
            CollectionReq = EntitiesCollections.where(v[0], v[1], v[2])
          } else {
            CollectionReq = CollectionReq.where(v[0], v[1], v[2])
          }
        } else {
          throw new Error('Where is in a Wrong format when ' + collection + ' entities is loading ')
        }
      })
    }
    if (!CollectionReq) {
      Database.Logger.log('-------- Replace CollectionReq --------------')
      // Database.Logger.debug(await getData(await CollectionReq.get()))
      CollectionReq = EntitiesCollections
    }
    let noLimitRequired = false
    if (orderBy) {
      if (verbose) {
        Database.Logger.log('Order by ' + orderBy[0])
        Database.Logger.log('Order ' + orderBy[1])
      }
      localData = localData.orderBy(orderBy[0], orderBy[1])
      CollectionReq = CollectionReq.orderBy(orderBy[0], orderBy[1])
    }
    if (startAfter) {
      let offset = localData.get().findIndex((data) => { return data[primaryKey] === startAfter.id }) + 1
      Database.Logger.log('offset', offset)
      // let startAt = startAfter
      // let endAt = startAfter + limit
      if (verbose) {
        Database.Logger.log('------------------------')
        Database.Logger.log('Start After ' + startAfter.id)
        // Database.Logger.log('End After ' + endAt)
      }
      localData = localData.offset(offset)
      CollectionReq = CollectionReq.startAfter(startAfter)
      // CollectionReq = CollectionReq.endAt(endAt)
      // noLimitRequired = true
    }
    if (limit && !noLimitRequired) {
      if (verbose) {
        Database.Logger.log('------------------------')
        Database.Logger.log('Limit :')
        Database.Logger.log(limit)
      }
      localData = localData.limit(limit)
      CollectionReq = CollectionReq.limit(limit)
    }
    // let syncObserver
    if (sync) {
      if (sync === true) {
        sync = ['modified', 'added', 'removed']
      }
      syncObserver = await dispatch('firestoreWatchEntities', {
        verbose,
        collection: CollectionReq,
        onDocChange,
        entity,
        sync
      })
    }
    if ((firestore && (!entity.databases[FirestoreId].allLoaded && lasyLoad)) || !lasyLoad) {
      try {
        response = await CollectionReq.get()
      } catch (e) {
        Database.Logger.error(e)
        throw e
      }
      // Database.Logger.log(r)
      if (verbose) {
        // let reponseData = []
        // Database.Logger.log('get data ==>')
        // Database.Logger.log('Response :')
        // // Database.Logger.log(response)
        // // Database.Logger.log(response)
        // response.forEach((doc) => {
        //   reponseData.push(doc.id)
        //   // reponseData.push(doc.id)
        // })
        // Database.Logger.log(reponseData)
      }

      entities = await getData(response)
      await dispatch(FirestoreId + '/' + collection + '/' + VuexOrmAction, {
        data: entities
      })
    }
    localDatabase = localData.get()
    // EntitiesCollections.
    // entities = await getData(await EntitiesCollections.get())
    if (verbose) {
      Database.Logger.log('Finish loading ' + collection + ' in ' + FirestoreId + ' database')
      if (Array.isArray(entities)) {
        Database.Logger.log('Has been loaded ' + entities.length + ' entites belows :')
        Database.Logger.debug(entities)
      }
      if (Array.isArray(localDatabase)) {
        Database.Logger.log('Has been loaded ' + localDatabase.length + ' in local database belows :')
        Database.Logger.debug(localDatabase)
      }
      Database.Logger.log('Come from the local store : ', !firestoreLoaded)
      Database.Logger.log('------------------------------------------------------')
    }
    return {
      firestoreLoaded,
      response,
      entities: entities,
      localDatabase,
      syncObserver
    }
  } catch (e) {
    if (verbose) {
      Database.Logger.log('Finish loading ' + collection + ' in ' + FirestoreId + ' database with error')
      Database.Logger.log(e)
      Database.Logger.trace(e)
    }
  }
  // let EntitiesCollections = firebase.firestore().collection('challenges')
  // let challenges = await getData(await EntitiesCollections.get())
  // let entity = await Challenge.insert({
  //   data: challenges
  // })
  // Challenge.isFetch = false
  // return entity
}

export async function firestoreAddEntities ({
  dispatch,
  getters
}, {
  entity,
  data = [],
  verbose = getters.debug,
  SubProcessVerbose = false,
  preSave = true,
  saveInDatabase = true,
  FirestoreId = getters.currentDatabaseId,
  ignoreFields = ['$id', 'id'],
  EntitiesCollections = false
}) {
  let collection = entity.entity
  if (EntitiesCollections === false) {
    EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
  }
  if (verbose) {
    Database.Logger.log('Start adding ' + collection + ' to ' + FirestoreId + ' database :')
    Database.Logger.log('Data to add')
    Database.Logger.log(data)
    Database.Logger.log('')
    Database.Logger.log('Will ignore fields : ', {
      ...ignoreFields
    })
    Database.Logger.log('Pre save request :', preSave)
    Database.Logger.log('Will save in database :', saveInDatabase)
    Database.Logger.log('------------------------------------------------------')
  }
  let Export = []
  let Options = {}
  data.forEach(v => {
    Options = {
      entity,
      verbose: SubProcessVerbose,
      data: v,
      preSave,
      saveInDatabase,
      ignoreFields,
      FirestoreId
    }
    Export.push(dispatch('firestoreEditEntity', Options))
  })
  return {
    Action: 'firestoreAddEntities',
    Options,
    ToDo: Export
  }
}

/**
 * Add Entity to firestore and syncronize it to the local store
 * @param dispatch
 * @param entity
 * @param verbose
 * @param data
 * @param preFetch
 * @param preSave
 * @param saveInDatabase
 * @param ignoreFields
 * @param FirestoreId
 * @returns {Promise<{databaseId: *, collection, action: string, localDatabase: {id}, entities: boolean}>}
 */
export async function firestoreAddEntity ({
  dispatch
}, {
  entity,
  verbose = false,
  data = {},
  preFetch = true,
  preSave = true,
  saveInDatabase = true,
  ignoreFields = ['$id', 'id'],
  FirestoreId = Database.currentId,
  EntitiesCollections = false
}) {
  let added = false
  let collection = entity.entity
  let request = {}
  let prepare = {
    ...data
  }
  let localId = false
  // let GetPath = FirestoreId + '/' + collection + '/query'
  let SavePath = FirestoreId + '/' + collection + '/insert'
  // let isExistLocaly = false
  if (EntitiesCollections === false) {
    EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
  }
  if (verbose) {
    Database.Logger.log('Start adding ' + collection + ' to ' + FirestoreId + ' database :')
    Database.Logger.log('Data to add')
    Database.Logger.debug('data', data)
    Database.Logger.log('Will ignore fields : ', {
      ...ignoreFields
    })
    Database.Logger.log('Pre save request :', preSave)
    Database.Logger.log('Will save in database :', saveInDatabase)
  }
  //
  // Pre Save on Local Store before injecting it into the database
  // That can make ORM hooks work on firestore database
  if (preSave) {
    let preparePreSave = await dispatch(SavePath, {
      data: data
    })
    let entities = preparePreSave[collection]
    if (entities.length === 1) {
      prepare = entities[0]
    }
    localId = prepare.$id
    if (verbose) {
      Database.Logger.log('Prepare save')
      Database.Logger.log('Store data :')
      Database.Logger.debug(prepare)
      Database.Logger.debug('Local ID', localId)
      Database.Logger.log('------------------------------------------------------')
    }
  }
  //
  // Remove Ignore Fields
  if (ignoreFields && Array.isArray(ignoreFields) && ignoreFields.length > 0) {
    request = removeIgnoredFields(prepare, [...ignoreFields, 'id'])
  }
  //
  // Save in database
  if (saveInDatabase) {
    if (Array.isArray(request)) {
      Database.Logger.log('@todo : ')
      Database.Logger.log('add multiple update into Database manager firestoreAddEntity action line 149')
    } else {
      // let Entity = EntitiesCollections.doc(id)
      try {
        await dispatch('firestoreDeleteEntity', {
          id: localId,
          entity,
          FirestoreId,
          Firestore: false,
          EntitiesCollections
        })
        added = await EntitiesCollections.add({
          ...request
        })
        await dispatch(SavePath, {
          data: {
            ...request,
            id: added.id
          }
        })
      } catch (e) {
        throw e
      }
    }
  }
  if (verbose) {
    Database.Logger.log('')
    Database.Logger.log('Finish adding ' + collection + ' entity in ' + FirestoreId + ' database')
    Database.Logger.log(entity.primaryKey + ' : ', added.id)
    Database.Logger.log('Added Data :')
    Database.Logger.log({
      ...request,
      id: added.id
    })
    Database.Logger.log('Add in Firestore : ', saveInDatabase)
    Database.Logger.log('Return : ')
    Database.Logger.debug({
      databaseId: FirestoreId,
      collection: collection,
      action: 'firestoreAddEntity',
      localDatabase: {
        ...request,
        id: added.id
      },
      entities: added
    })
    Database.Logger.log('------------------------------------------------------')
  }
  return {
    databaseId: FirestoreId,
    collection: collection,
    action: 'firestoreAddEntity',
    localDatabase: {
      ...request,
      id: added.id
    },
    entities: added
  }
}

/**
 * Update Entity in firestore and Local Data
 * @param dispatch
 * @param id
 * @param entity
 * @param data
 * @param verbose
 * @param preSave
 * @param saveInDatabase
 * @param FirestoreId
 * @param ignoreFields
 * @returns {Promise<*>}
 */
export async function firestoreEditEntity ({
  dispatch
}, {
  id = false,
  entity,
  data,
  verbose,
  preSave = true,
  saveInDatabase = 'not-used',
  Firestore = true,
  firestoreMethod = 'set',
  FirestoreId = Database.currentId,
  ignoreFields = ['$id', 'id'],
  waitFirestore = true,
  EntitiesCollections = false
}) {
  let firestoreResponse = false
  let request = {}
  let collection = false
  if (entity) {
    collection = entity.entity
  }
  let primary = entity.primaryKey
  if (id === false && data[primary]) {
    id = data[primary]
  }
  if (EntitiesCollections === false) {
    EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
  }
  // To make saveInDatabase keep working
  if (saveInDatabase !== 'not-used') {
    Firestore = saveInDatabase
  }
  if (verbose) {
    Database.Logger.log('')
    Database.Logger.log('Start editing ' + collection + ' entity in ' + FirestoreId + ' database')
    Database.Logger.log(entity.primaryKey + ' : ', id)
    Database.Logger.log('With this data :')
    Database.Logger.log(data)
    Database.Logger.log('Save in database :', saveInDatabase)
    Database.Logger.log('Firestore save methods :', firestoreMethod)
    // Database.Logger.log('preSave', preSave)
    Database.Logger.log('Will ignore :')
    Database.Logger.log(ignoreFields)
    Database.Logger.log('------------------------------------------------------')
  }
  if (id === false) {
    return await dispatch('firestoreAddEntity', {
      entity,
      data,
      verbose,
      preSave,
      FirestoreId,
      ignoreFields,
      EntitiesCollections
    })
  } else {
    let prepare = {
      ...data
    }
    prepare[primary] = id
    let path = FirestoreId + '/' + collection + '/insertOrUpdate'
    //
    // Pre Save on Local Store before injecting it into the database
    // That can make ORM hooks work on firestore database
    if (preSave) {
      let preparePreSave = await dispatch(path, {
        data: prepare
      })
      let entities = preparePreSave[collection]
      if (entities.length === 1) {
        prepare = entities[0]
      }
      if (verbose) {
        Database.Logger.log('------------------------------------------------------')
        Database.Logger.log('Pre Save with')
        // for (let prop in prepare) {
        //   Database.Logger.log(prop, prepare[prop])
        // }
        // Database.Logger.log(prepare)
      }
    }
    //
    // Remove Ignore Fields
    request = removeIgnoredFields(prepare, ignoreFields)
    //
    // Save in database
    if (Firestore) {
      // let EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
      if (Array.isArray(request)) {
        Database.Logger.log('@todo: add multiple update into Database manager firestoreEditEntity action line 149')
      } else {
        let Entity = EntitiesCollections.doc(id)
        try {
          if (waitFirestore) {
            await Entity[firestoreMethod]({
              ...request
            })
          } else {
            Entity[firestoreMethod]({
              ...request
            })
          }
          Database.Logger.log('has save')
          let dataStore = {
            ...request
          }
          dataStore[primary] = id
          await dispatch(path, {
            data: dataStore
          })
        } catch (e) {
          if (verbose) {
            Database.Logger.log(data.researchAge)
            Database.Logger.log('Error -----------------------------------------------------------')
            Database.Logger.log(e)
            Database.Logger.log('-- Error ------------ Make a rollback ---------------------------')
          }
          let rollbackData = await Entity.get()
          await dispatch('firestoreEditEntity', {
            id,
            data: rollbackData,
            entity,
            preSave,
            FirestoreId,
            saveInDatabase: false,
            EntitiesCollections,
            ignoreFields
          })
          throw e
        }
      }
    }
    if (verbose) {
      Database.Logger.log('Finish editting ' + collection + ' entity in ' + FirestoreId + ' database')
      Database.Logger.log(entity.primaryKey + ' : ', id)
      Database.Logger.log('')
      Database.Logger.log('Editted Data :')
      Database.Logger.log({
        ...request
      })
      Database.Logger.log('Edited in Firestore : ', saveInDatabase)
      if (saveInDatabase) {
        Database.Logger.log('Firestore reponse :')
        Database.Logger.log(firestoreResponse)
        Database.Logger.log('------------------------------------------------------')
      }
    }
    return {
      databaseId: FirestoreId,
      collection: collection,
      action: 'firestoreEditEntity',
      request,
      firestoreResponse
    }
  }
}

export async function firestoreDeleteEntities ({
  dispatch,
  getters
}, {
  entity,
  data = [],
  verbose = getters.debug,
  SubProcessVerbose = false,
  Firestore = true,
  EntitiesCollections = false,
  FirestoreId = getters.currentDatabaseId
}) {
  let collection = entity.entity
  if (EntitiesCollections === false) {
    EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
  }
  if (verbose) {
    Database.Logger.log('Start deleting ' + collection + ' to ' + FirestoreId + ' database :')
    Database.Logger.log('Data to add')
    Database.Logger.log(data)
    Database.Logger.log('')
    Database.Logger.log('------------------------------------------------------')
  }
  let Export = []
  let Options = {}
  data.forEach(v => {
    Options = {
      id: v.id,
      entity,
      verbose: SubProcessVerbose,
      Firestore,
      EntitiesCollections,
      FirestoreId
    }
    Export.push(dispatch('firestoreDeleteEntity', Options))
  })
  return {
    Action: 'firestoreDeleteEntities',
    Options,
    ToDo: Export
  }
}

/**
 * Delete Entity In Firestore
 * @param dispatch
 * @param id
 * @param entity
 * @param verbose
 * @param FirestoreId
 * @param Firestore
 * @returns {Promise<*>}
 *
 * @todo Rename Firestore param
 */
export async function firestoreDeleteEntity ({
  dispatch
}, {
  id,
  entity,
  verbose = false,
  FirestoreId = Database.currentId,
  EntitiesCollections = false,
  Firestore = true
}) {
  let collection = entity.entity
  let path = FirestoreId + '/' + collection + '/delete'
  if (EntitiesCollections === false) {
    EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
  }
  if (verbose) {
    let sentence = 'Start Deleting ' + collection + ' to ' + FirestoreId + ' database :'
    Database.Logger.log(sentence)
    Database.Logger.log('Delete in Firestore : ', Firestore)
    Database.Logger.log(entity.primaryKey + ' : ', id)
  }
  if (Firestore) {
    // let EntityCollections = Database.firestores[FirestoreId].collection(collection)
    await EntitiesCollections.doc(id).delete()
  }
  return await dispatch(path, id)
}

/**
 * Return data without ignored fields
 * @param data
 * @param ignoredFields
 * @returns {FormatedData}
 */
function removeIgnoredFields (data = {}, ignoredFields = []) {
  let request = {}
  if (Array.isArray(data)) {
    Database.Logger.log('is Array !!!!!')
  } else {
    data = {
      ...data
    }
  }
  for (let save in data) {
    if (!ignoredFields.includes(save)) {
      if (Array.isArray(data[save])) {
        data[save] = [...data[save]]
      }
      request[save] = data[save]
    }
  }
  return request
}
