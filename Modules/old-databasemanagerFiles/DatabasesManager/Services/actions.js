import Database from '../DatabaseManager'
import {
  getData
} from '../libs/FirebaseUtils'
import { DatabaseManager } from '..'
// import { DatabaseManager } from '..'
let localLogger = Database.Logger

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
// 
// Function to translate Firebase where call to an Vuex ORM where
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
function AsyncTimeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function CreateLocalWhere (data, condition, debug = false) {
  // console.log(data)
  let debugOut = condition[0] + ' '
  // console.log(condition)
  let value
  if (typeof data[condition[0]] !== 'undefined') {
    value = data[condition[0]]
  }
  return debug ? debugOut += condition[1] + ' ' + condition[2] : booleanOperation(value, condition[1], condition[2])
}
function VuexOrmQueryBuilder (query, params = {}, debug = true) {
  let queryName = debug === true || debug === false ? '' : debug + '.'
  let QueryPreparation = query()
  let debugOut = '\n' + queryName + 'query()\n'
  let canNotBeChainable = ['']
  for (let paramKey in params) {
    let paramItem = params[paramKey]
    if (Array.isArray(paramItem)) {
      for (let conditionKey in paramItem) {
        let condition = paramItem[conditionKey]
        // it's a condition
        if (Array.isArray(condition) && condition.length === 3) {
          debugOut += '  .' + paramKey + '(' + CreateLocalWhere('entry', condition, true) + ')\n'
          QueryPreparation[paramKey]((entry) => {
            return CreateLocalWhere(entry, condition)
          })
        } else if (Array.isArray(condition)) {
          debugOut += '  .' + paramKey + '('
          for (let cond in condition) {
            if (cond < condition.length - 1) {
              debugOut += condition[cond] + ','
            } else {
              debugOut += condition[cond] + ')\n'
            }
          }
          QueryPreparation[paramKey](...condition)
        } else {
          debugOut += '  .' + paramKey + '(' + condition + ')\n'
          QueryPreparation[paramKey](condition)
        }
      }
    } else if (paramItem !== false) {
      debugOut += '  .' + paramKey + '(' + paramItem + ')\n'
      QueryPreparation[paramKey](paramItem)
    }
  }
  return {
    debugOut,
    QueryPreparation
  }
}
function CollectionQueryBuilder (collection, params = {}, debug = true, localLogger = Database.Logger) {
  let queryName = debug === true || debug === false ? '' : debug
  let CollectionPreparation = collection
  let debugOut = '\ncollection(' + queryName + ')\n'
  let paramKey
  let conditionKey
  let condition
  let paramItem
  try {
    for (paramKey in params) {
      paramItem = params[paramKey]
      if (Array.isArray(paramItem)) {
        for (conditionKey in paramItem) {
          condition = paramItem[conditionKey]
          // it's a condition
          if (Array.isArray(condition)) {
            debugOut += '  .' + paramKey + '('
            for (let cond in condition) {
              if (cond < condition.length - 1) {
                debugOut += condition[cond] + ','
              } else {
                debugOut += condition[cond] + ')\n'
              }
            }
            if (paramKey === 'startAfter') {
              console.log('start after debug', paramItem)
            }
            CollectionPreparation = CollectionPreparation[paramKey](...condition)
          }
        }
      } else if (paramItem !== false && typeof paramItem !== 'function') {
        debugOut += '  .' + paramKey + '(' + paramItem + ')\n'
        if (paramKey === 'startAfter') {
          localLogger.log('start after debug', paramItem)
        }
        CollectionPreparation = CollectionPreparation[paramKey](paramItem)
      }
    }
  } catch (e) {
    localLogger.error('During CollectionQueryBuilder after ' + paramKey + ' firestore method for ' + conditionKey + ' argument')
    localLogger.error(debugOut)
    if (condition) {
      localLogger.error('condition', condition)
    }
    if (paramItem) {
      localLogger.error('Param Item', paramItem)
    }
    throw e
  }
  return {
    debugOut,
    CollectionPreparation
  }

}

// const Logger = localLogger

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
  localLogger = Database.Logger,
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
  // localLogger.log(hasToLoad)
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
    localLogger.log('Start loading one entity in ' + collection + ' collection ' + FirestoreId + ' database')
    localLogger.log(entity.primaryKey + ' : ', id)
    localLogger.log('Is all ready loaded all : ', entity.databases[FirestoreId].allLoaded)
    localLogger.log('Lasy load : ', lasyLoad)
    localLogger.log('Allready loaded :', allReadyLoaded)
    localLogger.log('Watch : ', watch)
  }
  if (!lasyLoad || (lasyLoad && !allReadyLoaded)) {
    EntitiesCollections = EntitiesCollections.doc(id)
    localLogger.log(watch)
    if (watch) {
      if (verbose) {
        localLogger.log('START WATCHING -------------------------------------')
        localLogger.log('Collection:' + collection + ' - Doc: ' + id + '-----------------------')
      }
      let watchSettings = {
        sync: true,
        ...watch
      }
      let watchEntity = await dispatch('firestoreWatchEntity', {
        localLogger,
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
      localLogger.log('Collection : ' + collection + ' - ' + id)
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
    localLogger.log('Finish loading ' + collection + ' entity in ' + FirestoreId + ' database')
    localLogger.log(entity.primaryKey + ' : ', id)
    localLogger.log('')
    localLogger.log('Return :')
    localLogger.log('data :', data)
    localLogger.log('Allready loaded :', allReadyLoaded)
    localLogger.log('exists :', exists)
    // localLogger.log('Has been updated localy :', localUpdate)
    localLogger.log('Firestore Loaded :', firestoreLoad)
    // localLogger.log('Link entity :', firestoreLoad)
    localLogger.log('------------------------------------------------------')
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
  localLogger = Database.Logger,
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
      localLogger.log('Change detected in ' + collection + ' on ' + FirestoreId + ' database')
      localLogger.log('On document : ' + snapshot.id)
      localLogger.log('Sync : ' + sync)
      localLogger.log('----------------------------------START-CHANGE-PROCESS')
    }
    let editedEntity = false
    if (sync) {
      // sync localy
      editedEntity = await dispatch('firestoreEditEntity', {
        localLogger,
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
      localLogger.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      localLogger.log('Error detected in ' + collection + ' on ' + FirestoreId + ' database')
      localLogger.log('On document : ' + snapshot.id)
      localLogger.log('Sync : ' + sync)
      localLogger.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      localLogger.error(error)
      localLogger.log('-------------------------------------------------STOP-CHANGE-PROCESS')
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
  localLogger = Database.Logger,
  collection,
  entity,
  sync = ['modified', 'added', 'removed'],
  onDocChange = false,
  beforeOnDocChange = false,
  afterOnDocChange = false,
  collectionName = entity.entity,
  FirestoreId = Database.currentId,
  verbose = true
}) {
  if (verbose) {
    localLogger.log('Start sync ')
    localLogger.log('sync:', sync)
    localLogger.log('On doc Change:', onDocChange)
  }
  let watcher = collection.onSnapshot(async (snapshot) => {
    if (verbose) {
      console.log('watcher active')
    }
    if (typeof beforeOnDocChange === "function") {
      beforeOnDocChange(snapshot)
    }
    if (verbose) {
      localLogger.log('Change detected in ' + collectionName + ' on ' + FirestoreId + ' database')
      localLogger.log('Sync : ' + sync)
      localLogger.log('Snapshot : ' + typeof onDocChange)
      localLogger.log(onDocChange)
      localLogger.log(snapshot.docChanges())
      localLogger.log('----------------------------------START-WATCHING-PROCESS')
    }
    // let editedEntity = false
    if (sync) {
      await snapshot.docChanges().forEach(async (change) => {
        let AllowedToSync = Array.isArray(sync) ? sync.includes(change.type) : false
        if (verbose) {
          // localLogger.log('----------------------------------CHANGE-DETECT-PROCESS')
          localLogger.log('Change detected in ' + collectionName + ' on ' + FirestoreId + ' database')
          localLogger.log('On document : ' + change.doc.id)
          localLogger.log('Type :', change.type)
          localLogger.log('Sync : ' + sync)
          localLogger.log('Snapshot : ' + typeof onDocChange)
          localLogger.log('async : ' + typeof onDocChange.then === 'function')
          localLogger.log(onDocChange.constructor.name)
          // localLogger.log(onDocChange instanceof Promise)
          localLogger.log('Allowed to sync : ' + AllowedToSync)
          localLogger.log('END----------------------------------------------------')
        }
        let data = change.doc.data()
        try {
          if (typeof onDocChange === 'function') {
            await onDocChange(change, data, snapshot)
          }
        } catch (e) {
          localLogger.error(e)
          localLogger.trace(e)
          throw e
        }
        if (AllowedToSync) {
          let syncActions = {
            added: 'firestoreEditEntity',
            modified: 'firestoreEditEntity',
            removed: 'firestoreDeleteEntity'
          }
          // onSnapshot()
          if (change.type === 'added' || change.type === 'modified') {
            // sync localy
            localLogger.log('EDIT----------------------------------------------------')
            try {
              await dispatch(syncActions[change.type], {
                localLogger,
                verbose,
                entity,
                id: change.doc.id,
                data,
                FirestoreId,
                saveInDatabase: false
              })
            } catch (e) {
              localLogger.log('FINISH-DELETE-WITH-ERROR--------------------------------------------------')
              localLogger.error(e)
              throw e
            }
          } else if (change.type === 'removed') {
            localLogger.log('DELETE----------------------------------------------------')
            try {
              await dispatch(syncActions[change.type], {
                localLogger,
                verbose,
                entity,
                id: change.doc.id,
                FirestoreId,
                Firestore: false
              })
            } catch (e) {
              localLogger.log('FINISH-DELETE-WITH-ERROR--------------------------------------------------')
              localLogger.error(e)
              throw e
            }
          }
        }
      })
    }
  }, (error) => {
    if (verbose) {
      localLogger.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      localLogger.log('Error detected in ' + collectionName + ' on ' + FirestoreId + ' database')
      localLogger.log('Sync : ' + sync)
      localLogger.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      localLogger.error(error)
      localLogger.log('-------------------------------------------------STOP-CHANGE-PROCESS')
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
  localLogger = Database.Logger,
  entity = false,
  pagination = false,
  collection = true,
  verbose = false,
  lasyLoad = true,
  firestore = true,
  orderBy = false,
  limit = false,
  startAfter = false,
  offset = false,
  onDocChange = false,
  beforeOnDocChange = false,
  sync = false,
  VuexOrmAction = 'insertOrUpdate',
  EntitiesCollections = false,
  foreachEntity = false,
  has = [],
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
    let reachLimit
    let lastDoc
    let response = false
    let entities = []
    let firestoreLoaded = false
    let localDatabase
    let subLoading = []
    let queryPath = FirestoreId + '/' + collection + '/query'
    let isWhere = Array.isArray(where) && where.length > 0
    let hasToLoadAll = !isWhere && !limit && !pagination && ((lasyLoad && !entity.databases[FirestoreId].allLoaded) || !lasyLoad)
    // hasToLoadAll = false
    // 
    // Set pagination and default params
    if (pagination === true) {
      pagination = {}
    }
    if (pagination !== false) {
      let defaultLimit = limit ? limit : 4
      let defaultPaginationParams = {
        // currentPage: 1,
        perPage: defaultLimit,
        shift: 0,
        excludes () {
          return false
        },
        scale () {
          return 1
        }
      }
      pagination = {...defaultPaginationParams, ...pagination}
      if (pagination.excludes && Array.isArray(pagination.excludes)) {
        pagination.excludes = function (item) {
          return pagination.includes(item[primaryKey])
        }
      }
      limit = pagination.perPage + pagination.shift
    } 

    if (verbose) {
      localLogger.log('Start loading ' + collection + ' in ' + FirestoreId + ' database')
      localLogger.log('Has a where request : ', isWhere)
      if (isWhere) {
        localLogger.log('@todo : ')
      }
      localLogger.log('Has to load all entities : ', hasToLoadAll)
      localLogger.log('Is all ready loaded all : ', entity.databases[FirestoreId].allLoaded)
      localLogger.log('Lasy load : ', lasyLoad)
      localLogger.log('------------------------------------------------------')
      localLogger.log('queryPath : ', queryPath)
      localLogger.log('Sync : ', sync)
      localLogger.log('Order By : ', orderBy)
      localLogger.log('------------------------------------------------------')
      localLogger.log('Has Pagination : ', Boolean(pagination))
      if (pagination) {
        localLogger.log('Per Page : ', pagination.perPage)
        localLogger.log('Shift : ', pagination.shift)
      }
    }
    //
    // Load All the database
    // @todo : need to put that down
    //
    // if (hasToLoadAll) {
    //   entities = await getData(await EntitiesCollections.get())
    //   firestoreLoaded = true
    //   entities.forEach(async (entity) => {
    //     try {
    //       await dispatch(FirestoreId + '/' + collection + '/' + VuexOrmAction, {
    //         data: [entity]
    //       })
    //     } catch (e) {
    //       localLogger.error(e)
    //       localLogger.error('Problem with ' + entity.uid || entity.id + ' for ' + collection)
    //     }
    //   })
    //   entity.databases[FirestoreId].allLoaded = true
    // }
    //
    // Handle where parametre
    let CollectionReq = false
    let localData = getters[queryPath]()
    let firestoreLocal = getters[queryPath]()
    let offsetLocal = []
    if (startAfter) {
      if (typeof startAfter === 'string') {
        startAfter = EntitiesCollections.doc(startAfter)
      }
      if (offset === false) {
        let forOffsetLocal = VuexOrmQueryBuilder(getters[queryPath], {
          where,
          has,
          orderBy,
          // limit
        }, collection)
        offsetLocal = forOffsetLocal.QueryPreparation.get()
        offset = offsetLocal.findIndex((data) => { return data[primaryKey] === startAfter.id }) + 1
        // if (offset === 0) {
        //   offset = 1
        // }
      }
      // let startAt = startAfter
      // let endAt = startAfter + limit
      if (verbose) {
        localLogger.log('------------------------')
        localLogger.log('Offset Query')
        localLogger.log('offset', offset)
        localLogger.log(offsetLocal.length)
        localLogger.log(offsetLocal)
        // localLogger.log('local offset Id : ', offsetLocal[offset - 1][primaryKey])
        if (typeof startAfter === 'string') {
          localLogger.log('Start After ' + startAfter)
        }
        // localLogger.log('End After ' + endAt)
      }
      // CollectionReq = CollectionReq.endAt(endAt)
      // noLimitRequired = true
    }
    
    if (lasyLoad && limit) {
      let prepareLasyloadVuex = VuexOrmQueryBuilder(getters[queryPath], {
        where,
        has,
        orderBy,
        offset,
        limit
      }, collection)
      let reachLasyloadLimit = prepareLasyloadVuex.QueryPreparation.get().length >= limit
      if (reachLasyloadLimit) {
        firestore = false
      }
      if (verbose) {
        localLogger.log('Because of the lasyload firestore is set to false')
      }
    }
    let collectionPreparation
    if ((firestore && (!entity.databases[FirestoreId].allLoaded && lasyLoad)) || !lasyLoad) {
      if (typeof startAfter.get === 'function') {
        startAfter = await startAfter.get()
      }
      collectionPreparation = CollectionQueryBuilder(EntitiesCollections, {
        where,
        orderBy,
        startAfter,
        limit
      }, collection)
      CollectionReq = collectionPreparation.CollectionPreparation
      if (verbose) {
        localLogger.log('Firestore query for ' + collection + ' entity', collectionPreparation.debugOut)
      }
      
      // let syncObserver
      if (sync) {
        if (sync === true) {
          // sync = ['modified', 'added', 'removed']
        }
        // localLogger.log('Sync collection Request', CollectionReq)
        syncObserver = await dispatch('firestoreWatchEntities', {
          localLogger,
          verbose,
          collection: CollectionReq,
          onDocChange,
          beforeOnDocChange,
          entity,
          sync
        })
      }
      try {
        response = await CollectionReq.get()
      } catch (e) {
        if (!localLogger) {
          localLogger = console
        }
        localLogger.error('During firebase collection get request')
        localLogger.error(e)
        throw e
      }
      // localLogger.log(r)
      if (verbose) {
        // let reponseData = []
        // localLogger.log('get data ==>')
        // localLogger.log('Response :')
        // // localLogger.log(response)
        // // localLogger.log(response)
        // response.forEach((doc) => {
        //   reponseData.push(doc.id)
        //   // reponseData.push(doc.id)
        // })
        // localLogger.log(reponseData)
      }
      if (firestore) {
        entities = await getData(response)
        await dispatch(FirestoreId + '/' + collection + '/' + VuexOrmAction, {
          data: entities
        })
      }
    }
    if (typeof foreachEntity === 'function') {
      let foreachPeparation = VuexOrmQueryBuilder(getters[queryPath], {
        where,
        offset,
        orderBy,
        limit
      }, collection)
      if (verbose) {
        // localLogger.log('foreach Entity query preparation ', foreachPeparation.debugOut)
      }
      let localEntityList = foreachPeparation.QueryPreparation.get()
      let entitiesToForEach = firestore ? entities : localEntityList
      for (let k in entitiesToForEach) {
        let data = entitiesToForEach[k] // firestoreEntity
        let firestoreData = firestore ? localEntityList.find(ld => data[primaryKey] === ld[primaryKey]) : false// localData
        await foreachEntity(data, firestoreData)
      }
    }
    // console.log(offset)
    let prepareVuex = VuexOrmQueryBuilder(getters[queryPath], {
      where,
      has,
      orderBy,
      offset,
      limit
    }, collection)
    if (verbose) {
      localLogger.log('', prepareVuex.debugOut)
    }

    // await AsyncTimeout(1000)
    // localLogger.log(prepareVuex.QueryPreparation.get())
    localDatabase = prepareVuex.QueryPreparation.get()
    let firestoreLocalResult = firestoreLocal.get()
    if (pagination) {
      reachLimit = localDatabase.length >= limit
      let lastVisible = firestore ? response.docs[response.docs.length - 1] : localDatabase[localDatabase.length - 1][primaryKey]
      if (verbose) {
        localLogger.log('Pagination result ')
        localLogger.log('local record : ' + localDatabase.length)
        localLogger.log(localDatabase.map(v => v.id))
        localDatabase.forEach(v => localLogger.debug(v.$toJson()))
        localLogger.log('firestore record : ' + entities.length)
        entities.forEach(v => localLogger.debug(v))
        localLogger.log(entities.map(v => v.id))
        localLogger.log('reach limit : ' + reachLimit)
        localLogger.log('start after : ' + lastVisible)
      }
      if (!reachLimit && lastVisible) {
        pagination.perPage = limit - localDatabase.length
        let subResponse = await dispatch('firestoreLoadEntities', {
          localLogger,
          entity,
          pagination,
          collection,
          verbose,
          lasyLoad,
          firestore,
          orderBy,
          limit,
          offset,
          startAfter: lastVisible,
          onDocChange,
          beforeOnDocChange,
          sync,
          VuexOrmAction,
          EntitiesCollections,
          foreachEntity,
          has,
          where,
          FirestoreId
        })
        subLoading = [subResponse, ...subResponse.subLoading]
        lastDoc = subResponse.lastDoc
        // firestoreLoaded = [...firestoreLoaded, ...subResponse.firestoreLoaded]
        // response = [...response, ...subResponse.firestoreLoaded]
        // entities = [...entities, ...subResponse.entities],
        localDatabase = [...localDatabase, ...subResponse.localDatabase]
        // syncObserver = [...syncObserver, ...subResponse.syncObserver]
      } else {
        lastDoc = lastVisible
      }
    }
    // EntitiesCollections.
    // entities = await getData(await EntitiesCollections.get())
    if (verbose) {
      localLogger.log('Finish loading ' + collection + ' in ' + FirestoreId + ' database')
      if (Array.isArray(entities)) {
        localLogger.log('Has been loaded ' + entities.length + ' entites belows :')
        localLogger.debug(entities)
      }
      if (Array.isArray(localDatabase)) {
        localLogger.log('Has been loaded ' + localDatabase.length + ' in local database belows :')
        localLogger.debug(localDatabase)
      }
      localLogger.log('Come from the local store : ', !firestoreLoaded)
      localLogger.log('Last doc', lastDoc)
      localLogger.log('reachLimit', reachLimit)
      localLogger.log('------------------------------------------------------')
    }
    return {
      firestoreLoaded,
      response,
      entities: entities,
      localDatabase,
      lastDoc,
      syncObserver,
      reachLimit,
      subLoading
    }
  } catch (e) {
    if (verbose) {
      if (typeof localLogger === 'undefined') {
        localLogger = console
      }
      localLogger.error('Finish loading ' + collection + ' in ' + FirestoreId + ' database with error')
      localLogger.error(e)
      localLogger.trace(e)
      // throw e
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
  localLogger = Database.Logger,
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
    localLogger.log('Start adding ' + collection + ' to ' + FirestoreId + ' database :')
    localLogger.log('Data to add')
    localLogger.log(data)
    localLogger.log('')
    localLogger.log('Will ignore fields : ', {
      ...ignoreFields
    })
    localLogger.log('Pre save request :', preSave)
    localLogger.log('Will save in database :', saveInDatabase)
    localLogger.log('------------------------------------------------------')
  }
  let Export = []
  let Options = {}
  data.forEach(v => {
    Options = {
      localLogger,
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
  localLogger = Database.Logger,
  entity,
  verbose = false,
  data = {},
  firestoreUID = true,
  preFetch = true,
  preSave = true,
  saveInDatabase = true,
  ignoreFields = ['$id', 'id'],
  FirestoreId = Database.currentId,
  EntitiesCollections = false
}) {
  let id
  let added = false
  let collection = entity.entity
  let request = {}
  let prepare = {
    ...data
  }
  let firestoreMethod = "add"
  let localId = false
  // let GetPath = FirestoreId + '/' + collection + '/query'
  let SavePath = FirestoreId + '/' + collection + '/insert'
  // let isExistLocaly = false
  if (EntitiesCollections === false) {
    EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
  }

  if (verbose) {
    localLogger.log('Start adding ' + collection + ' to ' + FirestoreId + ' database :')
    localLogger.log('Data to add')
    localLogger.debug('data', data)
    localLogger.log('Will ignore fields : ', {
      ...ignoreFields
    })
    localLogger.log('Pre save request :', preSave)
    localLogger.log('Will save in database :', saveInDatabase)
  }
  let localPreparation = {
    specifiqueFirestoreFields: []
  }
  if (firestoreUID) {
    EntitiesCollections = EntitiesCollections.doc()
    firestoreMethod = 'set'
  }
  //
  // Pre Save on Local Store before injecting it into the database
  // That can make ORM hooks work on firestore database
  if (preSave) {
    if (firestoreUID) {
      prepare.id = EntitiesCollections.id
    }
    localPreparation = prepareForLocal(prepare)
    localLogger.log('Preparation :', localPreparation)
    let preparePreSave = await dispatch(SavePath, {
      data: localPreparation.data
    })
    let entities = preparePreSave[collection]
    if (entities.length === 1) {
      let preparePreSaveData = entities[0]
      localPreparation.specifiqueFirestoreFields.forEach((v) => {
        preparePreSaveData[v] = prepare[v]
      })
      prepare = preparePreSaveData
    }
    localId = prepare.$id
    if (verbose) {
      localLogger.log('Prepare save')
      localLogger.log('Store data :')
      localLogger.debug(prepare)
      localLogger.debug('Local ID', localId)
      localLogger.log('------------------------------------------------------')
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
      localLogger.log('@todo : ')
      localLogger.log('add multiple update into Database manager firestoreAddEntity action line 149')
    } else {
      // let Entity = EntitiesCollections.doc(id)
      try {

        if (!firestoreUID) {
          await dispatch('firestoreDeleteEntity', {
            localLogger,
            id: localId,
            entity,
            FirestoreId,
            Firestore: false,
            EntitiesCollections
          })
        }
        added = await EntitiesCollections[firestoreMethod]({
          ...request
        })
        if (added) {
          id = added.id
        } else {
          id = localId
        }
        await dispatch(SavePath, {
          data: {
            ...request,
            id: id
          }
        })
      } catch (e) {
        throw e
      }
    }
  }
  if (verbose) {
    localLogger.log('')
    localLogger.log('Finish adding ' + collection + ' entity in ' + FirestoreId + ' database')
    localLogger.log(entity.primaryKey + ' : ', id)
    localLogger.log('Added Data :')
    localLogger.log({
      ...request,
      id: id
    })
    localLogger.log('Add in Firestore : ', saveInDatabase)
    localLogger.log('Return : ')
    localLogger.debug({
      databaseId: FirestoreId,
      collection: collection,
      action: 'firestoreAddEntity',
      localDatabase: {
        ...request,
        id: id
      },
      entities: added
    })
    localLogger.log('------------------------------------------------------')
  }
  return {
    databaseId: FirestoreId,
    collection: collection,
    action: 'firestoreAddEntity',
    localDatabase: {
      ...request,
      id: id
    },
    entities: added
  }
}

export function prepareForLocal (OriginalData, specifiqueFirestoreFields = false, localLogger = Database.Logger) {
  localLogger.log('Start prepare for local update')
  let speField = ['SERVER_TIMESTAMP', 'DELETE_FIELD']
  let speFieldValue = {
    SERVER_TIMESTAMP: new Date(),
    DELETE_FIELD: null
  }
  if (!Array.isArray(specifiqueFirestoreFields)) {
    specifiqueFirestoreFields = Object.keys(OriginalData).filter((k) => speField.includes(OriginalData[k]))
  }
  localLogger.log('Spécifique fields', specifiqueFirestoreFields)
  let data = {
    ...OriginalData
  }
  specifiqueFirestoreFields.forEach(v => {
    if (typeof data[v] !== 'undefined') {
      data[v] = speFieldValue[data[v]]
    }
  })
  localLogger.log('Finish to prepare')
  localLogger.log({
    data,
    specifiqueFirestoreFields
  })
  return {
    data,
    specifiqueFirestoreFields
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
  localLogger = Database.Logger,
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
  let toSaveLocaly = {}
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
    localLogger.log('')
    localLogger.log('Start editing ' + collection + ' entity in ' + FirestoreId + ' database')
    localLogger.log(entity.primaryKey + ' : ', id)
    localLogger.log('With this data :')
    localLogger.log(data)
    localLogger.log('Save in database :', saveInDatabase)
    localLogger.log('Firestore save methods :', firestoreMethod)
    // localLogger.log('preSave', preSave)
    localLogger.log('Will ignore :')
    localLogger.log(ignoreFields)
    localLogger.log('------------------------------------------------------')
  }
  if (id === false) {
    return await dispatch('firestoreAddEntity', {
      localLogger,
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
      let localPreparation = prepareForLocal(prepare)
      let preparePreSave = await dispatch(path, {
        data: localPreparation.data
      })
      let entities = preparePreSave[collection]
      if (entities.length === 1) {
        let preparePreSaveData = entities[0]
        localPreparation.specifiqueFirestoreFields.forEach((v) => {
          preparePreSaveData[v] = prepare[v]
        })
        prepare = preparePreSaveData

      }
      if (verbose) {
        localLogger.log('------------------------------------------------------')
        localLogger.log('Pre Save with')
        // for (let prop in prepare) {
        //   localLogger.log(prop, prepare[prop])
        // }
        // localLogger.log(prepare)
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
        localLogger.log('@todo: add multiple update into Database manager firestoreEditEntity action line 149')
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
          localLogger.log('has save')
          let dataStore = {
            ...request
          }
          dataStore[primary] = id
          toSaveLocaly = prepareForLocal(dataStore)
          await dispatch(path, {
            data: toSaveLocaly.data
          })
        } catch (e) {
          if (verbose) {
            localLogger.log(data.researchAge)
            localLogger.log('Error -----------------------------------------------------------')
            localLogger.log(e)
            localLogger.log('-- Error ------------ Make a rollback ---------------------------')
          }
          let rollbackData = await Entity.get()
          await dispatch('firestoreEditEntity', {
            localLogger,
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
      localLogger.log('Finish editting ' + collection + ' entity in ' + FirestoreId + ' database')
      localLogger.log(entity.primaryKey + ' : ', id)
      localLogger.log('')
      localLogger.log('Editted Data :')
      localLogger.log('with path :' + path)
      localLogger.log({
        toSaveLocaly
      })
      localLogger.log('Edited in Firestore : ', saveInDatabase)
      if (saveInDatabase) {
        localLogger.log('Firestore reponse :')
        localLogger.log(firestoreResponse)
        localLogger.log('------------------------------------------------------')
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
  localLogger = Database.Logger,
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
    localLogger.log('Start deleting ' + collection + ' to ' + FirestoreId + ' database :')
    localLogger.log('Data to add')
    localLogger.log(data)
    localLogger.log('')
    localLogger.log('------------------------------------------------------')
  }
  let Export = []
  let Options = {}
  data.forEach(v => {
    Options = {
      localLogger,
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
  localLogger = Database.Logger,
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
    localLogger.log(sentence)
    localLogger.log('Delete in Firestore : ', Firestore)
    localLogger.log(entity.primaryKey + ' : ', id)
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
function removeIgnoredFields (data = {}, ignoredFields = [], localLogger = Database.Logger) {
  let request = {}
  if (Array.isArray(data)) {
    localLogger.log('is Array !!!!!')
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
