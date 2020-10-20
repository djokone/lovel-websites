import Media from '@/Modules/Medias/Services/Media'
import Database from '@/Modules/DatabasesManager/DatabaseManager'

export async function getRefMediasFirebase ({
  dispatch
}, {
  verbose = false,
  refId,
  ref
}) {
  try {
    if (verbose) {
      console.log('Start getting Media By Ref : ' + ref)
      console.log('#######################################################')
    }
    let medias = await dispatch('firestoreLoadEntities', {
      verbose,
      entity: Media,
      where: [
        ['ref_id', '==', refId],
        ['ref', '==', ref]
      ]
    })
    if (medias.entities.length) {
      medias.entities.forEach((media) => {
        if (!media.storage_uri && !media.storage_uri.length && media.storage_path) {
          dispatch('addMediaStorageUri', {
            verbose,
            id: media.id,
            storagePath: media.storage_path
          })
        }
      })
    }
    return medias
  } catch (e) {
    error(e)
  }
}

export async function addMediaStorageUri ({
  dispatch
}, {
  id,
  storagePath,
  verbose
}) {
  let storageUri = await firebase.storage.getDownloadUrl({
    remoteFullPath: storagePath
  })
  console.log('---------------------')
  console.log('Get Storage Uri')
  dispatch('firestoreEditEntity', {
    id,
    entity: Media,
    data: {
      storageUri
    },
    verbose,
    firestoreMethod: 'update',
    preSave: false
  })
}

export async function adminDeleteMedia ({dispatch}, {
  entity,
  id
}) {
  try {
    let media = await dispatch('firestoreDeleteEntity', {
      id: id,
      entity,
      verbose: true
    })
    console.log('Success')
    console.log(media)
  } catch (e) {
    console.log(e)
    console.log('Cannot delete media')
    throw e
  }
}

export async function adminDeleteMedias ({dispatch, getters}, {
  entity = Media,
  data,
  verbose = getters.debug,
  FirestoreId = Database.currentId
}) {
  data.forEach(async (entity) => {
    if (entity.type === 'image') {
      let imageRef = storageRef.child(entity.storage_path)
      try {
        await imageRef.delete()
      } catch (e) {
        console.error(e)
        console.log('error in adminDeleteMedias action')
      }
    }
  })
  let mediaCollection = Database.firestores[FirestoreId].collection('medias')
  try {
    await dispatch('firestoreDeleteEntities', {
      entity,
      data,
      verbose,
      EntitiesCollections: mediaCollection
    })
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function adminLoadMedias ({ dispatch, getters }, params = {
  entity: Media,
  collection: 'medias',
  lasyLoad: true,
  query: false,
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    id: false,
    verbose: getters.debug,
    entity: Media,
    lasyLoad: false,
    collection: 'medias',
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  console.log(params)
  return await dispatch('firestoreLoadEntities', params)
}

export async function adminLoadMedia ({ dispatch, getters }, params = {
  id: false,
  lasyLoad: false,
  collection: 'medias',
  verbose: getters.debug,
  FirestoreId: Database.currentId
}) {
  let defaultParams = {
    id: false,
    verbose: getters.debug,
    entity: Media,
    lasyLoad: false,
    collection: 'medias',
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  return await dispatch('firestoreLoadEntity', params)
}

export async function adminEditMedia ({ dispatch }, {
  id,
  toSave,
  verbose,
  ignoreFields = ['id', '$id']
}) {
  console.log('start edit media')
  return await dispatch('firestoreEditEntity', {
    id,
    verbose,
    entity: Media,
    data: toSave,
    ignoreFields
  })
}
