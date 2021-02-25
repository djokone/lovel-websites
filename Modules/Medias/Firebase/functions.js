const functions = require('firebase-functions')
const admin = require('firebase-admin');
admin.initializeApp();
const {Storage} = require('@google-cloud/storage')
const mediaActions = require('./utils')
const {dirname, join} = require('path')
const sharp = require('sharp')
const {tmpdir} = require('os')
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
      await mediaActions.removeMedia({
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
  if (defaultBehavior && defaultBehavior.newStorageFile) {
    try {
      await mediaActions.addMedia({
        ...defaultBehavior.newStorageFile,
        object
      })
    } catch (e) {
      console.error('Error detected during resizeMediaForPrefixes')
      console.error('When ' + object.name + ' file is added')
      console.error(e)
      throw e
    }
  }
}

exports.resizeMediaForPrefixes = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .https
  .onCall(resizeMediaForPrefixesHandler)


async function resizeMediaForPrefixesHandler(data, context) {
  if (data) {

  }
  console.log('New added file detected')
  console.log('File : ' + data.name)
  if (defaultBehavior && defaultBehavior.newStorageFile) {
    try {
      await mediaActions.resizeMediaForPrefixes({
        ...defaultBehavior.newStorageFile,
        prefixesConfig,
        storage_path: data.storage_path,
        mediaCollection: true
      })
    } catch (e) {
      console.error('Error detected during resizeMediaForPrefixes')
      console.error('When ' + object.name + ' file is added')
      console.error(e)
    }
  }
}

async function isUserCover({storage_path}) {
  const filePath = storage_path
  const folders = filePath.split('/')
  const fileName = filePath.split('/').pop()
  // const collection = folders[0]
  const id = folders[1]
}

exports.mediaMigrate = functions
  .runWith({memory: "2GB", timeoutSeconds: 540})
  .https
  .onCall(migrationHandler)

// exports.mediaMigration = functions
//   .runWith({memory: "2GB", timeoutSeconds: 300})
//   .https
//   .onCall(migrationHandler)

async function migrationHandler(migrationOptions) {
  let {
    limit,
    check,
    version,
    wheres,
    direction,
    migrationChecks
  } = {
    limit: 'all',
    wheres: [],
    version: false,
    check: true,
    migrationChecks: false,
    formatOptions: false,
    format: true,
    direction: false,
    ...migrationOptions
  }
  let mediaCollection = db.collection('medias')
  const {migrations} = require('./migrations')
  console.log(`${migrations.length} migrations founded for media`)
  let medias = []
  if (Array.isArray(wheres)) {
    for (where of wheres) {
      console.log('Apply where filter : ' + where.join(' '))
      mediaCollection = mediaCollection.where(...where)
    }
  }
  if (typeof limit === 'number') {
    console.log('Active limit to ' + limit)
    mediaCollection = mediaCollection.limit(limit)
  }
  const mediasSnapshot = await mediaCollection.get()
  mediasSnapshot.forEach((media) => {
    medias.push({...media.data(), id: media.id})
  })
  console.log(`${medias.length} medias founded to check`)
  let ups = []
  let downs = []
  let checks = {}
  if (migrationChecks) {
    ups = migrationChecks.ups
    downs = migrationChecks.downs
    checks = migrationChecks.checks
    check = false
  }

  // check process
  if (check && migrations.length) {
    for (let mediaMigration of migrations) {
      if (!mediaMigration.version) {
        throw `Need migration version key to each migrations`
      }

      const checksPromises = medias.map((media) => {
        return mediaMigration.check(media)
      })
      checks[mediaMigration.version] = await Promise.all(checksPromises)
      ups = checks[mediaMigration.version].filter(check => check.isUp === true)
      downs = checks[mediaMigration.version].filter(check => !check.isUp)
    }
  }

  // migration direction
  const directions = ['up', 'down']
  if (typeof direction === 'string' && !directions.includes(direction)) {
    throw `Direction need to be 'up'||'down'||false actually : '${direction}'`
  } else if (direction === true) {
    direction = 'up'
  }
  if (direction) {

  }

  return {
    checks,
    ups,
    downs
  }
}

function getArgs(func) {
  return (func + '')
    .replace(/[/][/].*$/mg, '') // strip single-line comments
    .replace(/\s+/g, '') // strip white space
    .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
    .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
    .replace(/=[^,]+/g, '') // strip any ES6 defaults
    .split(',').filter(Boolean); // split & filter [""]
}

async function formatMediasHandler(formatMediasOptions, context) {
  let {
    migrationChecks,
    action,
    actionArgs,
    pipeArgs,
  } = {
    entitiesArgs: [],
    ...formatMediasOptions
  }
  console.log('Start formatMedia with')
  console.log('Migrations Checks : ')
  console.log('Action : ' + action)
  console.log('Action Args : ' + actionArgs)
  const allActions = Object.keys(mediaActions)
  let formatActionsResponses = []
  const actionsMapping = allActions.map((action) => {
    let actionsArgs = getArgs(mediaActions[action])
    actionsArgs[0] = actionsArgs[0].replace('{', '')
    if (actionsArgs.length && actionsArgs[actionsArgs.length - 1].match('}')) {
      actionsArgs.splice(actionsArgs.length - 1, 1)
    }
    return {
      action: action,
      actionsArgs
    }
  })
  if (!migrationChecks) {
    return {actionsMapping}
  }
  if (typeof migrationChecks === 'string') {
    migrationChecks = JSON.parse(migrationChecks)
  }
  let migrationChecksArray = []
  if (!Array.isArray(migrationChecks)) {
    const migrationVersions = Object.keys(migrationChecks)
    migrationVersions.forEach((v) => {
      migrationChecksArray = [
        ...migrationChecksArray,
        ...migrationChecks[v]
      ]
    })
  }
  console.log(migrationChecksArray.length + ' Migration found')
  const formatAction = mediaActions[action]
  if (typeof formatAction === 'function') {
    const actionsPromises = migrationChecksArray.map((migration) => {
      // console.log('Migration')
      // console.log(migration)
      const prepareArgs = {}
      actionArgs.forEach((arg) => {
        console.log('Pipe arg : ' + arg)
        console.log(pipeArgs[arg])
        if (typeof pipeArgs[arg] !== 'undefined') {
          if (typeof pipeArgs[arg].value !== 'undefined') {
            prepareArgs[arg] = pipeArgs[arg].value
          }
          console.log('pipeValue :')
          console.log(pipeArgs[arg].pipeValue && migration.media[pipeArgs[arg].pipeValue])
          if (pipeArgs[arg].pipeValue && migration.media[pipeArgs[arg].pipeValue]) {
            prepareArgs[arg] = migration.media[pipeArgs[arg].pipeValue]
          }
        }
      })
      console.log('Preparation :')
      console.log(prepareArgs)
      console.log('end Preparation :')
      return formatAction(prepareArgs)
    })
    try {
      formatActionsResponses = await Promise.all(actionsPromises)
      console.log(`${actionsPromises.length} ${actions} function has been executed and finished with success`)
      // await formatAction()
    } catch (e) {
      console.error(`During ${action} in FormatMediasHandler cloud function`)
      console.error(e)
    }
  }
  return {
    actionsMapping,
    formatActionsResponses
  }
}

exports.formatMedias = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .https
  .onCall(formatMediasHandler)
/**
 *
 * Expose changeStorageUsersMedia
 */
exports.migrateStoragePath = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .https
  .onCall(migrateStoragePathHandler)

const bucket = admin.storage().bucket();
const bucketName = bucket.name;

/**
 *
 * Migrate storagePath to add @p before the file index number
 * change old storagaPath name "{p}_{ref_id}.jpg" to new one "@p{p}_{ref_id}.jpg"
 * @param data
 * @param context
 * @returns {Promise<{renameUsersMedia: []}>}
 */
async function migrateStoragePathHandler(
  {
    renameCollection = false
  }, context) {
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

async function formatMediasWithStorageHandler(
  data = {
    verbose: false,
    ref: false,
    refId: false,
    ...data
  },
  context) {
  if (data.verbose) {
    console.log(`Start formatMediasWithStorage\n ref: ${data.ref}, refId: ${data.refId}`)
  }
  await formatMedias({
    ...data
  })
  // const medias = await db.collection('medias').where('ref', '==', 'users').get()
  // // console.debug(medias)
  // let renameUsersMedia = []
  // medias.forEach((snapshot) => {
  //   const media = snapshot.data()
  //   if (!media.storage_path) {
  //     console.warn(snapshot.id + ' has no storage path.')
  //   } else {
  //     const newStoragePath = renameMedia(media.storage_path)
  //     renameUsersMedia.push({
  //       id: snapshot.id,
  //       oldPath: media.storage_path,
  //       newPath: newStoragePath
  //     })
  //   }
  // })
  // const renameUserMediaPromises = renameUsersMedia.map(async ({oldPath, newPath, id}) => {
  //   const mediaDoc = db.collection('medias').doc(id)
  //   console.log('Rename ' + oldPath + ' to ' + newPath)
  //   return mediaDoc.set({storage_path: newPath}, {merge: true})
  // })
  // await Promise.all(renameUserMediaPromises)
  // return {
  //   renameUsersMedia
  // }
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


/**
 * Resize Storage_
 * @param resizeOptions
 * @param context
 * @returns {Promise<{selectedFile: {width: *, height: *}, upload: boolean, resizeOptions: {orientation: string, size: *, storage_path: *}, timestamp: number}>}
 */

const sizeInterval = 20

async function resizeFileHandler(resizeOptions, context) {
  try {
    let {
      orientation,
      size,
      storage_path
    } = {
      orientation: 'height',
      ...resizeOptions
    }
    let upload = false
    const filename = storage_path.split('/').pop()
    const resizedFolder = filename.replace(/.[a-zA-Z]+$/, '').replace(/@/g, '')
    const gcsDefaultBucket = gcs.bucket(bucketName)
    let folders = storage_path.split('/')
    folders.pop()
    folders = folders.join('/')
    const orientations = ['height', 'width']
    if (size.width || size.height) {
      orientation = orientations.reduce((acc, orient) => {
        if (size[orient]) {
          acc = orient
        }
        return acc
      })
      size = size[orientation]
    }
    const targetSize = Math.floor(size / sizeInterval) * sizeInterval
    const prefix = folders + '/' + resizedFolder
    const options = {
      prefix
    }
    console.log('Start to search for file in ' + prefix)
    const [files] = await gcsDefaultBucket.getFiles(options);
    let selectedFile = files.find((file) => {
      const matches = {
        height: '@resized_' + targetSize + '_[0-9]+?_' + filename,
        width: '@resized_[0-9]+?_' + targetSize + '_' + filename
      }
      return file.name.match(matches[orientation])
    })
    console.log('selected file : ' + selectedFile)
    if (!selectedFile) {
      const workingDir = join(tmpdir(), 'resize')
      const tmpFilePath = join(workingDir, [targetSize, filename].join('_'))
      const tmpResizedPath = join(workingDir, ['r', targetSize, filename].join('_'))
      await fs.ensureDir(workingDir)
      let newSize = {}
      newSize[orientation] = targetSize
      await gcsDefaultBucket.file(storage_path).download({destination: tmpFilePath})
      const localFile = await sharp(tmpFilePath).resize(newSize).toFile(tmpResizedPath)
      const newStoragePath = `${folders}/${resizedFolder}/@resized_${localFile.height}_${localFile.width}_${filename}`

      let [upload] = await gcsDefaultBucket.upload(tmpResizedPath, {
        destination: newStoragePath
      })
      selectedFile = {
        ...localFile,
        ...upload
      }
      await fs.remove(tmpFilePath)
    } else {
      const resized = selectedFile.name.split('@resized_')
      const [height, width] = resized[1].split('_')
      selectedFile = {
        ...selectedFile,
        height,
        width
      }
    }
    resizeOptions = {
      ...resizeOptions,
      size,
      orientation,
      storage_path
    }

    console.log('Found ' + files.length + ' file ')
    return {
      timestamp: admin.firestore.Timestamp.now().seconds,
      resizeOptions,
      selectedFile,
      upload
    }
  } catch (e) {
    console.error(e)
    throw e
  } finally {

  }
}


exports.resizeFile = functions
  .runWith({memory: "2GB", timeoutSeconds: 540})
  .https
  .onCall(resizeFileHandler)

exports.getMedia = functions.https.onCall((data, context) => {
  console.log(data)
  console.log(context.auth.uid)
})
