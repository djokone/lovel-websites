// import {db} from '@/config/firebaseLovelCloud'
// import * as firebase from 'firebase/app'
import Tag from '@/Modules/Tags/Services/Tag'
import interestTag from '@/Modules/Interets/Services/InterestTag'
import Database from '@/Modules/DatabasesManager/DatabaseManager'
// import Interest from '@/Modules/Interets/Services/Interest'
// import Interest from '@/Modules/Interets/Services/Interest'

export async function adminFirestoreLoadTag ({
  dispatch
}, {
  id,
  entity = Tag,
  verbose = false,
  lazyLoad = true,
  FirestoreId = Database.currentId
}) {
  return await dispatch('firestoreLoadEntity', {
    id,
    entity,
    verbose,
    lazyLoad,
    FirestoreId
  })
}

export async function adminAddTagToInterest ({
  dispatch,
  getters
}, {
  tag,
  verbose = getters.debug,
  interestId
}) {
  let tagAdded = await dispatch('adminFirestoreAddTag', {
    tag,
    verbose
  })
  let InterestTagCollection = await dispatch('firestoreLoadEntities', {
    entity: interestTag,
    verbose,
    where: [
      ['interest_id', '==', interestId],
      ['tag_id', '==', tagAdded.localDatabase.id]
    ]
  })
  let exists = InterestTagCollection.localDatabase.length !== 0
  if (!exists) {
    return await dispatch('firestoreAddEntity', {
      entity: interestTag,
      data: {
        'interest_id': interestId,
        'tag_id': tagAdded.localDatabase.id
      },
      verbose: getters.debug
    })
  }
}

export async function adminFirestoreAddTag ({
  dispatch,
  getters
}, {
  tag,
  verbose = getters.debug
}) {
  let Tags = await dispatch('firestoreLoadEntities', {
    entity: Tag,
    verbose,
    where: [
      ['name', '==', tag.name]
    ]
  })
  let exist = Tags.localDatabase.length !== 0
  if (!exist) {
    return await dispatch('firestoreAddEntity', {
      verbose,
      entity: Tag,
      data: tag
    })
  }
  Tags.localDatabase = Tags.localDatabase[0]
  return Tags
}

export async function adminFirestoreDeleteTag ({
  dispatch,
  getters
}, {
  id,
  verbose = getters.debug
}) {
  return dispatch('firestoreDeleteEntity', {
    entity: Tag,
    verbose,
    id
  })
}
