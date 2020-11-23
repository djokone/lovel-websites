const {tmpdir} = require('os')
const admin = require('firebase-admin');
// admin.initializeApp();
const {Storage} = require('@google-cloud/storage')
const {dirname, join} = require('path')
const sharp = require('sharp')
const fs = require('fs-extra')
const gcs = new Storage()
const bucket = admin.storage().bucket();
const bucketName = bucket.name;
const db = admin.firestore()
const gcsDefaultBucket = gcs.bucket(bucketName)
const workingDir = join(tmpdir(), 'resize')
const tmpFilePath = join(workingDir, 'source.png')

// Default resize config
const prefixesConfig = {
  users: [
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
  medias: [
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

function mapMetadata(storage_path, selectedConfig) {
  const bucketDir = dirname(storage_path)
  const filename = storage_path.split('/').pop().split('.')[0]
  const ext = storage_path.split('.').pop()
  const imageName = storage_path.replace('.' + ext, '')
  const prefixFilename = `${filename}@resized_${selectedConfig.name}.${ext}`
  // console.log('get prefix metadata')
  // console.log(config)
  const newImageName = `${imageName}@resized_${selectedConfig.name}.${ext}`
  const tmpDestination = join(workingDir, prefixFilename)
  const destination = join(bucketDir, prefixFilename)
  return {...selectedConfig, ext, imageName, destination, tmpDestination}
}

// exports.getPrefixesPath = getPrefixesPathMetadata
/**
 *
 * Upload resized Medias prefixes process
 * @param storage_path
 * @param bucketName
 * @param id
 * @param addMedia
 * @param mediaCollection
 * @param cleanMedia
 * @param storage_path - Media storage path
 * @param bucketName - Storage bucket name
 * @param id - Media id
 * @param addMedia - Add Media if id is false or null
 * @param mediaCollection - Handle media collection synchronization
 * @param coverId - Cover id
 * @param coverCollection - Handle cover collection sync
 * @param prefixConfig
 * @param admin - Admin cloud function instance
 * @param db - firestore instance admin.firestore() by default
 * @param object - Storage meta image object
 * @returns {Promise<boolean|{mediaCollection: boolean, storage_path: *, id: boolean, coverCollection: boolean, prefixesPaths: {}, uploads: unknown[]}>}
 */
exports.resizeMediaForPrefixes = resizeMediaForPrefixes

async function resizeMediaForPrefixes(
  {
    id = false,
    addMedia = false,
    mediaCollection = true,
    cleanMedia = false,
    coverId = false,
    coverCollection = true,
    // prefixesConfig = prefixesConfig,
    object,
    storage_path = object.name
  }) {

  // Declare use full file constants

  // const gcpBucket = gcs.bucket(bucketName)
  if (typeof object === 'undefined') {
    let fileExist = await gcsDefaultBucket.file(storage_path).exists()
    fileExist = fileExist[0]
    console.log('File exist response : ' + fileExist)
    if (fileExist) {
      const data = await gcsDefaultBucket.file(storage_path).getMetadata()
      object = data[0]
    } else {
      console.warn('Object is undefined and file doesn\'t exist')
      return false
    }
  }
  const filePath = storage_path
  const folders = filePath.split('/')
  folders.pop()
  const fileName = filePath.split('/').pop()
  let mediaId = id
  let media = null
  // const bucketDir = dirname(filePath)
  const workingDir = join(tmpdir(), 'resize')
  const tmpFilePath = join(workingDir, 'source.png')
  // const collection = isCover
  // stop process if it has nothing to do
  // if (typeof prefixesConfig[collection] === 'undefined') {
  //   console.warn(collection + ' prefix config doesn\'t exist in function file for media')
  //   return false
  // }

  // Stop process if it's a resized image or not an image at all
  if (fileName.includes('@resized_') || !object.contentType.includes('image')) {
    return false
  }
  console.log('Start resizeMediaForPrefixes function with args')
  console.log('Storage path    : ' + storage_path)
  console.log('id              : ' + id)
  console.log('addMedia        : ' + addMedia)
  console.log('mediaCollection : ' + mediaCollection)
  console.log('coverCollection : ' + coverCollection)
  console.log('coverId         : ' + coverId)
  console.log('cleanMedia      : ' + cleanMedia)

  // Auto Collection cover
  if (coverCollection === true) {
    coverCollection = folders[0]
    if (typeof coverId !== 'string') {
      coverId = folders[1]
    }
    console.log('Auto collection took ')
    console.log('coverId : ' + coverId)
  }

  // Resize with user cover process
  if (coverCollection && !fileName.includes('@p1_' && coverCollection)) {
    coverCollection = false
    console.log('Cancel cover collection resize process')
    // await isUserCover({storage_path: filePath})
    // collection = 'medias'
  }

  // Auto Collection media
  if (mediaCollection) {
    if ('string' === !typeof mediaCollection) {
      mediaCollection = 'medias'
      console.log('Default mediaCollection is now ' + mediaCollection)
    }

    // Auto media id
    if (mediaId === true) {
      let mediaData = []
      console.log('Start to search if ' + storage_path + ' all ready exist in ' + mediaCollection + ' collection')
      const mediaSnapshot = await db.collection(mediaCollection).where('storage_path', '==', storage_path).get()
      mediaSnapshot.forEach((media) => {
        mediaData.push({...media.data(), id: doc.id})
      })
      console.log('found ' + mediaData.length + ' ' + mediaCollection)
      if (mediaData.length > 0) {
        media = mediaData[0]
        mediaId = media.id
      } else {
        media = null
        console.warn('no medias found')
      }
      if (cleanMedia && mediaData.length > 1) {
        console.warn('Todo : Clean medias process')
      }
    }

    // Add new media id
    if (addMedia && !media && mediaCollection) {
      mediaId = db.collection(mediaCollection).doc()
      console.log('Start to create a new doc with')
      console.log('media id : ' + mediaId)
    }
  }
  console.log('Automatic params has been set')
  console.log('Storage path    : ' + storage_path)
  console.log('id              : ' + id)
  console.log('addMedia        : ' + addMedia)
  console.log('mediaCollection : ' + mediaCollection)
  console.log('coverCollection : ' + coverCollection)
  console.log('coverId         : ' + coverId)
  console.log('cleanMedia      : ' + cleanMedia)

  // Prepare config data
  let configs = prefixesConfig['medias']
  if (coverId && coverCollection) {
    configs = prefixesConfig['users']
  }
  const prefixesPathData = configs.map((config) => mapMetadata(storage_path, config))
  // console.log('prefixesPathData ---------------------------------------')
  // console.log(prefixesPathData)
  // console.log('End of prefixesPathData ---------------------------------------')
  console.log('Number of prefixes path : ' + prefixesPathData.length)
  console.log('prefixes path data : ')
  console.log(prefixesPathData)
  // prefixes handled
  let prefixesPaths = {}
  for (let data of prefixesPathData) {
    prefixesPaths[data.name] = data.destination
  }

  // Make working dir exist
  await fs.ensureDir(workingDir)

  // Upload prefixes image
  const fileExist = await gcsDefaultBucket.file(storage_path).exists()
  const isFileExist = fileExist[0]
  if (isFileExist) {
    await gcsDefaultBucket.file(storage_path).download({destination: tmpFilePath})
    console.log('File download to ' + tmpFilePath)
  } else {
    console.warn('File doesn\'t exist')
    console.warn('Path : ' + filePath)
    return false
  }
  const uploadPromises = prefixesPathData.map(async (data) => {
    console.log('Resize upload to ' + data.tmpDestination)
    await sharp(tmpFilePath).resize(data.size).toFile(data.tmpDestination)
    console.log('Start upload ' + data.tmpDestination + ' to ' + data.destination)
    return gcsDefaultBucket.upload(data.tmpDestination, {
      destination: data.destination,
      metaData: {
        mediaId,
        coverCollection,
        coverId,
        mediaCollection
      }
    })
  })
  const uploads = await Promise.all(uploadPromises)

  // Start to handle media collection and set data
  console.log('Will set media : ' + mediaCollection && mediaId)
  if (mediaCollection && mediaId) {
    console.log('Start media collection')
    console.log('Start to set ' + mediaCollection + ' #' + mediaId)
    try {
      await db.collection(mediaCollection).doc(mediaId).set({
        storage_path,
        prefixesPaths
      }, {merge: true})
      console.log('Finish to set ' + mediaCollection + ' #' + mediaId)
    } catch (e) {
      console.error('During ' + mediaCollection + ' #' + mediaId)
      console.error('storage_path  : ' + storage_path)
      console.error('storage_path  : ' + prefixesPaths)
      console.error(e)
    }
  }

  // Start to handle cover collection and set data
  console.log('Will set cover : ' + mediaCollection && mediaId)
  if (coverCollection && coverId) {
    console.log('Start to set ' + coverCollection + ' #' + coverId)
    try {
      await db.collection(coverCollection).doc(coverId).set({
        storage_path,
        prefixesPaths,
      }, {merge: true})
    } catch (e) {
      console.error('During ' + coverCollection + ' #' + coverId)
      console.error('storage_path  : ' + storage_path)
      console.error('storage_path  : ' + prefixesPaths)
      console.error(e)
    }
    console.log('Finish to set ' + coverCollection + ' #' + coverId)
  }
  await fs.remove(workingDir)
  return {
    uploads,
    id,
    mediaCollection,
    coverCollection,
    storage_path,
    prefixesPaths
  }
}

/**
 * Remove media in collections
 * @param storagePath
 * @param bucketName
 * @param id
 * @param coverId
 * @param coverCollection
 * @param removeCollectionPrefix
 * @param removeMediaPrefixesStorage
 * @param mediaId
 * @param object
 * @param admin
 * @returns {Promise<null>}
 */
exports.removeMedia = removeMedia

async function removeMedia(
  {
    bucketName,
    id = false,
    coverId = true,
    coverCollection = true,
    deletePrefixesCollection = true,
    deletePrefixes = true,
    mediaId = true,
    object,
    storagePath = object.name
  }) {
  // const db = admin.firestore()
  if (typeof storagePath !== 'string') {
    console.error('storagePath : ' + storagePath)
    throw 'Storage path is not a string'
  }
  const folders = storagePath.split('/')
  const filename = storagePath.split('/').pop()
  const ext = filename.split('.')[1]
  let originalStorage = storagePath
  let prefix = false
  if (storagePath.includes('@resized_')) {
    originalStorage = filename.split('@resized_')[0] + '.' + ext
    // prefix = filename.split('@resized_')[1].split('.')[0]
  }
  const isCover = storagePath.includes('@p1_')

  // Auto cover collection
  if (coverCollection === true && isCover) {
    coverCollection = folders[0]
  }

  // Auto coverId find process
  if (coverId === true && isCover) {
    coverId = folders[1]
  }

  // Get automatically media id
  if (mediaId === true) {
    mediaId = object.mediaId
    console.log('Metadata mediaId : ' + mediaId)
    if (typeof mediaId === 'undefined') {
      let ids = []
      const snapshot = await db.collection('medias').where('storage_path', '==', originalStorage).get()
      snapshot.forEach(doc => {
        ids.push(doc.id)
      })
      if (!snapshot.empty) {
        mediaId = false
      } else {
        mediaId = ids[0]
      }
    }
  }

  // remove file fields if it's resized file
  if (storagePath.includes('@resized_')) {
    prefix = filename.split('@resized_')[1].split('.')[0]

    // remove cover collection fields
    if (isCover && coverCollection) {
      console.log('Start to remove ' + coverCollection + ' #' + coverId + ' fields')
      await resetCollectionFromMedia({
        collection: coverCollection,
        id: coverId,
        storage_path: false,
        prefix,
        db
      })
    }

    // remove media fields
    if (mediaId) {
      console.log('Start to remove media #' + mediaId + ' fields')
      await resetCollectionFromMedia({
        collection: 'medias',
        id: mediaId,
        prefix,
        storage_path: false,
        db
      })
    }
  }
  // Stop process if it's a resized image or not an image at all
  if (storagePath.includes('@resized_') || !object.contentType.includes('image')) {
    return null
  }

  // Set cover collection document
  if (isCover && coverCollection && coverId) {
    await resetCollectionFromMedia({
      collection: coverCollection,
      id: coverId,
      db
    })
  }

  // Set media collection document
  if (mediaId) {
    await removeMediaCollection({
      storage_path: storagePath,
      id: mediaId,
      admin,
      db
    })
  }

  // Delete prefixes files
  if (deletePrefixes) {
    deletePrefixes = await deletePrefixesFiles({storage_path: storagePath})
  }

  return {
    mediaId,
    coverId,
    coverCollection,
    deletePrefixes
  }
}

async function replaceCover(
  {
    storage_path,
    mediaId,
    coverCollection
  }) {
  // const gcpBucket = gcs.bucket(bucketName)
  const pos = storage_path.match(/@p[0-9]+_/)
  const newStoragePath = storage_path.replace(pos, '@p1_')

}


async function resetCollectionFromMedia(
  {
    id,
    collection,
    storage_path = true,
    prefix = false,
    // db
  }
) {
  const data = {}
  if (storage_path) {
    data['storage_path'] = db.FieldValue.delete()
  }
  if (prefix) {
    data['prefixesUrl'] = {}
    data['prefixesUrl'][prefix] = db.FieldValue.delete()
  } else if (prefix === 'all') {
    data['prefixesUrl'] = db.FieldValue.delete()

  }
  console.log('Start to set ' + collection + ' #' + id)
  console.log('Prefix     : ' + prefix)
  console.log('All        : ' + all)
  console.log('With datas :')
  console.log(data)
  await db.collection(collection).doc(id).set(data, {merge: true})
  return {
    id,
    collection,
    storage_path,
    prefix,
    // db
  }
}

async function removeMediaCollection(
  {
    storage_path,
    id = true,
    deleteAllMatched = true,
    // db
  }) {
  let media = null
  let medias = []
  if (typeof id !== 'string') {
    let snapshots = await db.collections('medias').where('storage_path', '==', storage_path).get()
    snapshots.forEach((snap) => {
      medias.push({
        ...snap.data(),
        id: snap.id
      })
    })
  } else {
    media = await db.collections('medias').doc(id)
    medias.push(media)
  }
  let promises = medias.map((media) => {
    console.log('Start to delete media #' + media.id + ' document')
    return db.collection('medias').doc(media.id).delete()
  })
  if (medias.length > 1 && !deleteAllMatched) {
    promises = [promises[0]]
  }
  console.log('Start to delete ' + promises.length + ' medias document')
  const promisesResponses = await Promise.all(promises)
  console.log('Finish to delete medias document')
  return {
    promisesResponses,
    medias,
    id,
    storage_path
  }
}

const asyncFilter = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
}


async function deletePrefixesFiles(
  {
    storage_path = null,
    silent = true
  }) {
  if (!storage_path) {
    let e = 'Need a valid storage_path, actually ' + storage_path
    console.error(e)
    if (silent) {
      return null
    } else {
      throw e
    }
  }
  const filePath = storage_path.split('/').pop()
  const folders = storage_path.split('/')
  folders.pop()
  const folderPath = folders.join('/')
  const selectConfig = prefixesConfig['users']
  const prefixesPathData = selectConfig.map((config) => {
    return mapMetadata(storage_path, config)
  })
  // })
  // getPrefixesPathMetadata(storage_path, config)
  console.log('Start to get files in ' + storage_path + ' in storage')
  let prefixesPathToDelete = []
  // console.log('prefixesPathData ---------------------------------------')
  // console.log(prefixesPathData)
  // console.log('End of prefixesPathData ---------------------------------------')
  // const prefixesPathToDelete = await asyncFilter(prefixesPathData, async (index) => {
  //   let fileExist = await gcsDefaultBucket.file(prefixesPathData[index].destination).exists()
  //   return fileExist[0]
  // })
  for (prefix of prefixesPathData) {
    const fileExist = await gcsDefaultBucket.file(prefix.destination).exists()
    if (fileExist[0]) {
      prefixesPathToDelete.push(prefix)
    } else {
      console.log('File ' + prefix.destination + ' doesn\'t exist')
    }
  }
  console.log(prefixesPathToDelete.length + ' path to delete')
  const promises = prefixesPathToDelete.map((prefix) => {
    console.log('Start to delete ' + prefix.destination + ' file')
    return gcsDefaultBucket.file(prefix.destination).delete()
  })
  await Promise.all(promises)
  console.log(prefixesPathToDelete.length + ' files has been deleted')
  return {
    prefixesFilesDeleted: prefixesPathToDelete
  }
}
