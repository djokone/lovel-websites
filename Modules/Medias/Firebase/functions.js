const functions = require('firebase-functions')
const admin = require('firebase-admin');
admin.initializeApp();
const {Storage} = require('@google-cloud/storage')
const {resizeMediaForPrefixes, removeMedia} = require('./utils')
const {dirname, join} = require('path')
const sharp = require('sharp')
const fs = require('fs-extra')
const gcs = new Storage()
const db = admin.firestore()
const syncStorageWithMedia = true

// Default behavior config
const defaultBehavior = {
  "deleteStorageFile": {
    "id": true,
    "coverCollection": true,
    "coverId": true,
    "deletePrefixesCollection": true,
    "deletePrefixes": true
    // "formatMedia": "remove",
    // "formatCover": "replace"
  },
  "newStorageFile": {
    "id": true,
    "mediaCollection": "medias", // "string" | Boolean
    "coverCollection": true,
    "coverId": true,
    "addMedia": true,
    "cleanMedia": true
  }
}

// Resize config
const prefixesConfig = {
  "users": [
    {
      "name": "extra_small",
      "size": 15
    },
    {
      "name": "small",
      "size": 40
    },
    {
      "name": "thumb",
      "size": 200
    },
    {
      "name": "medium",
      "size": 400
    },
    {
      "name": "big",
      "size": 800
    },
    {
      "name": "fullscreen",
      "size": 1080
    }
  ],
  "medias": [
    {
      "name": "medium",
      "size": 400
    },
    {
      "name": "big",
      "size": 800
    },
    {
      "name": "fullscreen",
      "size": 1080
    }
  ]
}


exports.deleteStorageFile = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .storage
  .object()
  .onDelete(onDeleteMediaHandler)

/**
 * Handle function when a file is deleted in firebase storage
 * @param object
 * @returns {Promise<void>}
 */
async function onDeleteMediaHandler(object) {
  // const bucket = gcs.bucket(object.bucket)
  // const filePath = object.name
  console.log('Delete file detected')
  console.log('File : ' + object.name)
  if (defaultBehavior && defaultBehavior.deleteStorageFile) {
    console.log('Start to remove Media')
    try {
      await removeMedia({
        ...defaultBehavior.deleteStorageFile,
        // storagePath: object.name,
        object
      })
    } catch (e) {
      console.error('Error detected during removeMedia')
      console.error('For ' + object.name + ' file')
      console.error(e)
    }
  }

}

// When a new Image added to storage hook

exports.addStorageFile = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .storage
  .object()
  .onFinalize(onFinalizeMediaHandler)

/**
 * When a new image is added to google storage
 * @param object - Image added metadata
 * @returns {Promise<boolean|{id: *, collection: *, prefixesPaths: {}, uploads: *}>}
 */
async function onFinalizeMediaHandler(object) {
  // const bucket = gcs.bucket(object.bucket)
  const filePath = object.name
  console.log('New added file detected')
  console.log('File : ' + object.name)
  if (defaultBehavior && defaultBehavior.deleteStorageFile) {
    try {
      await resizeMediaForPrefixes({
        ...defaultBehavior.newStorageFile,
        object,
        prefixesConfig,
        mediaCollection: true
      })
    } catch (e) {
      console.error('Error detected during resizeMediaForPrefixes')
      console.error('When ' + object.name + ' file is added')
      console.error(e)
    }
  }
}

exports.resizeMediaForPrefixes = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .https
  .onCall(resizeMediaForPrefixes)


async function isUserCover({storage_path}) {
  const filePath = storage_path
  const folders = filePath.split('/')
  const fileName = filePath.split('/').pop()
  // const collection = folders[0]
  const id = folders[1]
}


exports.changeStorageUsersMediaName = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .https
  .onCall(changeStorageUsersMediaNameHandler)

const bucket = admin.storage().bucket();
const bucketName = bucket.name;

/**
 *
 * @param data
 * @param context
 * @returns {Promise<{renameUsersMedia: []}>}
 */
async function changeStorageUsersMediaNameHandler(data, context) {
  const gcpBucket = gcs.bucket(bucketName)
  const medias = await db.collection('medias').where('ref', '==', 'users').get()
  // console.debug(medias)
  let renameUsersMedia = []
  medias.forEach((snapshot) => {
    const media = snapshot.data()
    if (!media.storage_path) {
      console.warn(snapshot.id + ' has no storage path.')
    } else {
      const newStoragePath = renameMedia(media.storage_path)
      if (newStoragePath !== media.storage_path) {
        renameUsersMedia.push({
          id: snapshot.id,
          oldPath: media.storage_path,
          newPath: newStoragePath
        })
      } else {
        console.warn(snapshot.id + ' is allready renamed')
      }
    }
  })
  const renameUserMediaPromises = renameUsersMedia.map(async ({oldPath, newPath, id}) => {
    // console.log('bucket name')
    // console.log(bucket)
    await gcpBucket.file(oldPath).move(newPath)
    const mediaDoc = db.collection('medias').doc(id)
    console.log('Rename ' + oldPath + ' to ' + newPath)
    return mediaDoc.set({storage_path: newPath}, {merge: true})
  })
  await Promise.all(renameUserMediaPromises)
  return {
    renameUsersMedia
  }
}

function renameMedia(storagePath) {
  const folders = storagePath.split('/')
  folders.pop()
  const fileName = storagePath.split('/').pop()
  const nameChunk = fileName.split('_')
  const isOldName = /^[1-9]_/g
  if (nameChunk.length === 2 && fileName.match(isOldName)) {
    const newFileName = '@p' + nameChunk[0] + '_' + nameChunk[1]
    return [...folders, newFileName].join('/')
  } else {
    return storagePath
  }
}

exports.formatMediasWithStorage = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .https
  .onCall(formatMediasWithStorageHandler)

async function formatMediasWithStorageHandler(data, context) {
  const medias = await db.collection('medias').where('ref', '==', 'users').get()
  // console.debug(medias)
  let renameUsersMedia = []
  medias.forEach((snapshot) => {
    const media = snapshot.data()
    if (!media.storage_path) {
      console.warn(snapshot.id + ' has no storage path.')
    } else {
      const newStoragePath = renameMedia(media.storage_path)
      renameUsersMedia.push({
        id: snapshot.id,
        oldPath: media.storage_path,
        newPath: newStoragePath
      })
    }
  })
  const renameUserMediaPromises = renameUsersMedia.map(async ({oldPath, newPath, id}) => {
    const mediaDoc = db.collection('medias').doc(id)
    console.log('Rename ' + oldPath + ' to ' + newPath)
    return mediaDoc.set({storage_path: newPath}, {merge: true})
  })
  await Promise.all(renameUserMediaPromises)
  return {
    renameUsersMedia
  }
}

exports.removePublicUrl = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .https
  .onCall(removePublicUrl)

async function removePublicUrl(data, context) {
  data = {
    collection: 'medias',
    wheres: [['ref', '==', 'users']],
    ...data
  }
  let medias = db.collection(data.collection)
  if (Array.isArray(data.wheres)) {
    data.wheres.forEach((where) => {
      if (Array.isArray(where) && where.length === 3) {
        medias = medias.where(...where)
      }
    })
  }
  medias = await medias.get()
  let renameUsersMedia = []
  medias.forEach((snapshot) => {
    renameUsersMedia.push({
      id: snapshot.id
    })
  })
  const renameUserMediaPromises = renameUsersMedia.map(async ({id}) => {
    const mediaDoc = db.collection(data.collection).doc(id)
    console.log('remove ' + data.collection + 'public url for id ' + id)
    return mediaDoc.set({storage_uri: null}, {merge: true})
  })
  await Promise.all(renameUserMediaPromises)
  return {
    renameUsersMedia
  }
}

exports.saveCoverToUser = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .https
  .onCall(saveCoverToUser)

async function saveCoverToUser(data, context) {
  const medias = await db.collection('medias').where('ref', '==', 'users').get()
  // console.debug(medias)
  let renameUsersMedia = []
  medias.forEach((snapshot) => {
    const media = snapshot.data()
    if (!media.storage_path) {
      console.warn(snapshot.id + ' has no storage path.')
      return false
    }
    const filename = media.storage_path.split('/').pop()
    if (filename.includes('@p1')) {
      renameUsersMedia.push({
        id: snapshot.id,
        storage_path: media.storage_path,
        ref_id: media.ref_id
      })
    }
  })
  const renameUserMediaPromises = renameUsersMedia.map(async ({storage_path, ref_id}) => {
    const mediaDoc = db.collection('users').doc(ref_id)
    console.log('Save ' + storage_path + ' to user #' + ref_id)
    return mediaDoc.set({storage_path: storage_path}, {merge: true})
  })
  await Promise.all(renameUserMediaPromises)
  return {
    renameUsersMedia
  }
}


exports.getMedia = functions.https.onCall((data, context) => {
  console.log(data)
  console.log(context.auth.uid)
})
