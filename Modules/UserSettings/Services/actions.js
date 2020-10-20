import Database from '@/Modules/DatabasesManager/DatabaseManager'
import UserSettings from '@/Modules/UserSettings/Services/UserSettings'

export async function adminLoadUserSettings ({
  dispatch,
  getters
}, params = {
  entity: UserSettings,
  collection: 'userSettings',
  id: false,
  lasyLoad: true,
  query: false,
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    entity: UserSettings,
    collection: 'userSettings',
    id: false,
    lasyLoad: true,
    query: false,
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  return await dispatch('firestoreLoadEntity', params)
}
