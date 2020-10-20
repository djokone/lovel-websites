import Database from '@/Modules/DatabaseManager/DatabaseManager'
import {getData} from '@/libs/FirebaseUtils'

export function adminChangeCurrentDatabase ({commit}, newVal) {
  Database.changeCurrentId(newVal)
  commit('changeCurrentDatabase', newVal)
}
export function adminToogleDebug ({commit}, newVal) {
  commit('toogleDebug')
}

/**
 * Load Entities from firestore and save it in the local database
 * @param dispatch
 * @param entity
 * @param collection
 * @param verbose
 * @param lasyLoad
 * @param where
 * @param FirestoreId
 * @returns {Promise<{firestoreLoaded: boolean, entities: boolean}>}
 */
export async function firestoreLoadEntities (
  {dispatch, getters},
  {
    entity = false,
    collection = true,
    verbose = false,
    lasyLoad = true,
    firestore = true,
    where = [],
    FirestoreId = Database.currentId
}) {
  try {
    if (collection === true) {
      collection = entity.entity
    }
    let EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
    entity.isFetch = true
    let entities = false
    let firestoreLoaded = false
    let localDatabase
    let queryPath = FirestoreId + '/' + collection + '/query'
    let isWhere = Array.isArray(where) && where.length > 0
    let hasToLoadAll = !isWhere && ((lasyLoad && !entity.databases[FirestoreId].allLoaded) || !lasyLoad)
    if (verbose) {
      console.log('######################################################')
      console.log('Start loading ' + collection + ' in ' + FirestoreId + ' database')
      console.log('######################################################')
      console.log('Has a where request : ', isWhere)
      if (isWhere) {
        console.log('@todo : ')
      }
      console.log('Has to load all entities : ', hasToLoadAll)
      console.log('Is all ready loaded all : ', entity.databases[FirestoreId].allLoaded)
      console.log('Lasy load : ', lasyLoad)
      console.log('------------------------------------------------------')
      console.log('queryPath : ', queryPath)
      console.log('------------------------------------------------------')
    }
    //
    // Load All the database
    if (hasToLoadAll) {
      entities = await getData(await EntitiesCollections.get())
      firestoreLoaded = true
      await dispatch(FirestoreId + '/' + collection + '/insert', {
        data: entities
      })
      entity.databases[FirestoreId].allLoaded = true
    }
    //
    // Handle where parametre
    if (isWhere) {
      let localData = getters[queryPath]()
      let CollectionReq = false
      where.forEach((v) => {
        if (typeof v === 'function') {
          console.log('@todo : Add function type for where in the local store for adminFirebaseLoadEntities')
        } else if (Array.isArray(v) && v.length === 3) {
          localData = localData.where(v[0], v[2])
          if (!CollectionReq) {
            CollectionReq = EntitiesCollections.where(v[0], v[1], v[2])
          }
          CollectionReq = CollectionReq.where(...v)
        } else {
          throw new Error('Where is in a Wrong format when ' + collection + ' entities is loading ')
        }
      })
      if (!CollectionReq) {
        CollectionReq = EntitiesCollections
      }
      if ((firestore && (!entity.databases[FirestoreId].allLoaded && lasyLoad)) || !lasyLoad) {
        entities = await getData(await CollectionReq.get())
        await dispatch(FirestoreId + '/' + collection + '/insertOrUpdate', {
          data: entities
        })
      }
      localDatabase = localData.get()
      // EntitiesCollections.
      // entities = await getData(await EntitiesCollections.get())
    }
    if (verbose) {
      console.log('######################################################')
      console.log('Finish loading ' + collection + ' in ' + FirestoreId + ' database')
      console.log('######################################################')
      if (Array.isArray(entities)) {
        console.log('Has been loaded ' + entities.length + ' entites belows :')
        console.log(entities)
      }
      if (Array.isArray(localDatabase)) {
        console.log('Has been loaded ' + localDatabase.length + ' in local database belows :')
        console.log(localDatabase)
      }
      console.log('Come from the local store : ', !firestoreLoaded)
      console.log('------------------------------------------------------')
    }
    return {
      firestoreLoaded,
      entities: entities,
      localDatabase
    }
  } catch (e) {
    if (verbose) {
      console.log('######################################################')
      console.log('Finish loading ' + collection + ' in ' + FirestoreId + ' database')
      console.log('######################################################')
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

/**
 *
 * @param dispatch
 * @param params
 * @returns {Promise<firebase.firestore.DocumentSnapshot>}
 */
export async function firestoreLoadEntity ({dispatch}, {
  id = false,
  entity,
  collection = '',
  verbose = false,
  lasyLoad = true,
  FirestoreId = Database.currentId
}) {
  if (collection === '') {
    collection = entity.entity
  }
  let localUpdate = false
  let firestoreLoad = false
  if (verbose) {
    console.log('######################################################')
    console.log('Start loading ' + collection + ' entity in ' + FirestoreId + ' database')
    console.log(entity.primaryKey + ' : ', id)
    console.log('######################################################')
    console.log('------------------------------------------------------')
    console.log('Is all ready loaded all : ', entity.databases[FirestoreId].allLoaded)
    console.log('Lasy load : ', lasyLoad)
    console.log('------------------------------------------------------')
  }
  let EntitiesCollections = Database.firestores[FirestoreId].collection(collection).doc(id)
  if (verbose) {
    console.log('Collection : ' + collection + ' - ' + id)
    console.log(EntitiesCollections)
    console.log('')
  }
  let entities = await EntitiesCollections.get()
  firestoreLoad = true
  let data = entities.data()
  await dispatch(FirestoreId + '/' + collection + '/insertOrUpdate', {
    data: {
      id: id,
      ...data
    }
    // insertOrUpdate: ['interests']
  })
  localUpdate = true
  if (verbose) {
    console.log('######################################################')
    console.log('Finish loading ' + collection + ' entity in ' + FirestoreId + ' database')
    console.log(entity.primaryKey + ' : ', id)
    console.log('######################################################')
    console.log('')
    console.log('Loaded Data :')
    console.log(data)
    console.log('Updated locally : ', localUpdate)
    console.log('------------------------------------------------------')
  }
  return {
    entity,
    localUpdate,
    firestoreLoad
  }
}

export async function firestoreAddEntities ({dispatch, getters}, {
  entity,
  data = [],
  verbose = getters.debug,
  SubProcessVerbose = false,
  preSave = true,
  saveInDatabase = true,
  FirestoreId = getters.currentDatabaseId,
  ignoreFields = ['$id', 'id']
}) {
  let collection = entity.entity
  if (verbose) {
    console.log('######################################################')
    console.log('Start adding ' + collection + ' to ' + FirestoreId + ' database :')
    console.log('Data to add')
    console.log(data)
    console.log('######################################################')
    console.log('')
    console.log('Will ignore fields : ', {...ignoreFields})
    console.log('Pre save request :', preSave)
    console.log('Will save in database :', saveInDatabase)
    console.log('------------------------------------------------------')
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
export async function firestoreAddEntity ({dispatch}, {
  entity,
  verbose = false,
  data = {},
  preFetch = true,
  preSave = true,
  saveInDatabase = true,
  ignoreFields = ['$id', 'id'],
  FirestoreId = Database.currentId
}) {
  let added = false
  let collection = entity.entity
  let request = {}
  let prepare = {...data}
  let localId = false
  // let GetPath = FirestoreId + '/' + collection + '/query'
  let SavePath = FirestoreId + '/' + collection + '/insert'
  // let isExistLocaly = false
  if (verbose) {
    console.log('######################################################')
    console.log('Start adding ' + collection + ' to ' + FirestoreId + ' database :')
    console.log('Data to add')
    console.log(data)
    console.log('######################################################')
    console.log('')
    console.log('Will ignore fields : ', {...ignoreFields})
    console.log('Pre save request :', preSave)
    console.log('Will save in database :', saveInDatabase)
    console.log('------------------------------------------------------')
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
      console.log('Prepare save')
      console.log('Store data :')
      console.log(prepare)
      console.log('Local ID', localId)
      console.log('------------------------------------------------------')
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
    let EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
    if (Array.isArray(request)) {
      console.log('@todo : ')
      console.log('add multiple update into Database manager firestoreAddEntity action line 149')
    } else {
      // let Entity = EntitiesCollections.doc(id)
      try {
        await dispatch('firestoreDeleteEntity', {
          id: localId,
          entity,
          FirestoreId,
          Firestore: false
        })
        added = await EntitiesCollections.add(
          {
            ...request
          }
        )
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
    console.log('')
    console.log('######################################################')
    console.log('Finish adding ' + collection + ' entity in ' + FirestoreId + ' database')
    console.log(entity.primaryKey + ' : ', added.id)
    console.log('######################################################')
    console.log('Added Data :')
    console.log({
      ...request,
      id: added.id
    })
    console.log('Add in Firestore : ', saveInDatabase)
    console.log('Return : ')
    console.log({
      databaseId: FirestoreId,
      collection: collection,
      action: 'firestoreAddEntity',
      localDatabase: {
        ...request,
        id: added.id
      },
      entities: added
    })
    console.log('------------------------------------------------------')
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
export async function firestoreEditEntity ({dispatch}, {
  id = false,
  entity,
  data,
  verbose,
  preSave = true,
  saveInDatabase = true,
  FirestoreId = Database.currentId,
  ignoreFields = ['$id', 'id']
}) {
  let firestoreResponse = false
  let request = {}
  let collection = entity.entity
  if (id === false && data.id) {
    id = data.id
  }
  if (verbose) {
    console.log('')
    console.log('######################################################')
    console.log('Start editing ' + collection + ' entity in ' + FirestoreId + ' database')
    console.log(entity.primaryKey + ' : ', id)
    console.log('######################################################')
    console.log('With this data :')
    console.log(data)
    console.log('Save in database :', saveInDatabase)
    console.log('preSave', preSave)
    console.log('Will ignore :')
    console.log(ignoreFields)
    console.log('------------------------------------------------------')
  }
  if (id === false) {
    return await dispatch('firestoreAddEntity', {
      entity,
      data,
      verbose,
      preSave,
      FirestoreId,
      ignoreFields
    })
  } else {
    let prepare = {...data, id}
    let path = FirestoreId + '/' + collection + '/insertOrUpdate'
    //
    // Pre Save on Local Store before injecting it into the database
    // That can make ORM hooks work on firestore database
    if (preSave) {
      let preparePreSave = await dispatch(path, {
        data: data
      })
      let entities = preparePreSave[collection]
      if (entities.length === 1) {
        prepare = entities[0]
      }
      if (verbose) {
        console.log('------------------------------------------------------')
        console.log('Pre Save with')
        console.log(prepare)
      }
    }
    //
    // Remove Ignore Fields
    request = removeIgnoredFields(prepare, ignoreFields)
    //
    // Save in database
    if (saveInDatabase) {
      let EntitiesCollections = Database.firestores[FirestoreId].collection(collection)
      if (Array.isArray(request)) {
        console.log('@todo: add multiple update into Database manager firestoreEditEntity action line 149')
      } else {
        let Entity = EntitiesCollections.doc(id)
        try {
          await Entity.set(
            {
              ...request
            }
          )
        } catch (e) {
          if (verbose) {
            console.log('-- Error ------------ Make a rollback ---------------------------')
          }
          let rollbackData = await Entity.get()
          await dispatch('firestoreEditEntity', {
            id,
            data: rollbackData,
            entity,
            preSave,
            FirestoreId,
            saveInDatabase: false,
            ignoreFields
          })
          throw e
        }
      }
    }
    if (verbose) {
      console.log('######################################################')
      console.log('Finish editting ' + collection + ' entity in ' + FirestoreId + ' database')
      console.log(entity.primaryKey + ' : ', id)
      console.log('######################################################')
      console.log('')
      console.log('Editted Data :')
      console.log({
        ...request
      })
      console.log('Edited in Firestore : ', saveInDatabase)
      if (saveInDatabase) {
        console.log('Firestore reponse :')
        console.log(firestoreResponse)
        console.log('------------------------------------------------------')
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

export async function firestoreDeleteEntities ({dispatch, getters}, {
  entity,
  data = [],
  verbose = getters.debug,
  SubProcessVerbose = false,
  Firestore = true,
  FirestoreId = getters.currentDatabaseId
}) {
  let collection = entity.entity
  if (verbose) {
    console.log('######################################################')
    console.log('Start deleting ' + collection + ' to ' + FirestoreId + ' database :')
    console.log('Data to add')
    console.log(data)
    console.log('######################################################')
    console.log('')
    console.log('------------------------------------------------------')
  }
  let Export = []
  let Options = {}
  data.forEach(v => {
    Options = {
      id: v.id,
      entity,
      verbose: SubProcessVerbose,
      Firestore,
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
 */
export async function firestoreDeleteEntity ({dispatch}, {
  id,
  entity,
  verbose = false,
  FirestoreId = Database.currentId,
  Firestore = true
}) {
  let collection = entity.entity
  let path = FirestoreId + '/' + collection + '/delete'
  if (verbose) {
    console.log('######################################################')
    let sentence = 'Start Deleting ' + collection + ' to ' + FirestoreId + ' database :'
    console.log(sentence)
    console.log('Delete in Firestore : ', Firestore)
    console.log(entity.primaryKey + ' : ', id)
    console.log('######################################################')
  }
  if (Firestore) {
    let EntityCollections = Database.firestores[FirestoreId].collection(collection)
    await EntityCollections.doc(id).delete()
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
    console.log('is Array !!!!!')
  } else {
    data = {...data}
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
