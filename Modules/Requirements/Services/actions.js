import Database from '@/Modules/DatabasesManager/DatabaseManager'
import LogicGroup from './LogicGroup'
import Requirement from './Requirement'

export async function adminLoadLogicGroups ({
  dispatch,
  getters
}, params = {
  entity: LogicGroup,
  collection: 'logicGroups',
  lasyLoad: true,
  query: false,
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    entity: LogicGroup,
    collection: 'logicGroups',
    lasyLoad: true,
    query: false,
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  return await dispatch('firestoreLoadEntities', params)
}

export async function adminLoadLogicGroup ({
  dispatch,
  getters
}, params = {
  id: false,
  collection: 'logicGroups',
  lasyLoad: true,
  query: false,
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    entity: LogicGroup,
    collection: 'logicGroups',
    lasyLoad: true,
    query: false,
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  return await dispatch('firestoreLoadEntitiy', params)
}

export async function adminAddPredefinedLogicGroup ({
  dispatch,
  getters
}, {
  preSave = true,
  toSave,
  verbose = getters.debug,
  ignoreFields = ['$id', 'id']
}) {
  return await dispatch('firestoreAddEntity', {
    entity: LogicGroup,
    preSave,
    verbose,
    data: toSave,
    ignoreFields
  })
}

export async function adminRemovePredefinedLogicGroup ({
  dispatch,
  getters
}, {
  id,
  verbose = getters.debug,
  entity = LogicGroup
}) {
  return await dispatch('firestoreDeleteEntity', {
    id,
    verbose,
    entity
  })
}

export async function adminEditLogicGroup ({
  dispatch,
  getters
}, {
  id,
  toSave,
  verbose = getters.debug,
  ignoreFields = ['$id', 'id']
}) {
  return await dispatch('firestoreEditEntity', {
    id,
    entity: LogicGroup,
    data: toSave,
    verbose,
    ignoreFields
  })
}

export async function adminLoadRequirements ({
  dispatch,
  getters
}, params = {
  entity: Requirement,
  collection: 'requirements',
  lasyLoad: true,
  query: false,
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    entity: Requirement,
    collection: 'requirements',
    lasyLoad: true,
    query: false,
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  return await dispatch('firestoreLoadEntities', params)
}

export async function adminLoadRequirement ({
  dispatch,
  getters
}, params = {
  entity: Requirement,
  collection: 'requirements',
  lasyLoad: true,
  query: false,
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    entity: Requirement,
    collection: 'requirements',
    lasyLoad: true,
    query: false,
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  return await dispatch('firestoreLoadEntities', params)
}

export async function adminAddPredefinedRequirement ({
  dispatch,
  getters
}, {
  preSave = true,
  toSave,
  verbose = getters.debug,
  ignoreFields = ['$id', 'id']
}) {
  return await dispatch('firestoreAddEntity', {
    entity: Requirement,
    preSave,
    verbose,
    data: toSave,
    ignoreFields
  })
}

export async function adminRemoveRequirement ({
  dispatch,
  getters
}, {
  id,
  verbose = getters.debug,
  entity = Requirement
}) {
  return await dispatch('firestoreDeleteEntity', {
    id,
    verbose,
    entity
  })
}

export async function adminEditRequirement ({
  dispatch,
  getters
}, {
  id,
  toSave,
  verbose = getters.debug,
  ignoreFields = ['$id', 'id']
}) {
  return await dispatch('firestoreEditEntity', {
    id,
    entity: Requirement,
    data: toSave,
    verbose,
    ignoreFields
  })
}
