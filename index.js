const functions = require('firebase-functions');
const {Nuxt} = require('nuxt');
const {resizeFile, mediaMigrate, formatMedias, getMedia, addStorageFile, changeStorageUsersMediaName, formatMediasWithStorage, removePublicUrl, saveCoverToUser, resizeMediaForPrefixes, deleteStorageFile} = require('./Modules/Medias/Firebase/functions')
const {cleanUsersCollection} = require('./Modules/Users/Firebase/functions')

const nuxtConfig = require('./nuxt.config.js');
// console.log(nuxtConfig)
const config = {
  ...nuxtConfig,
  dev: false,
  debug: true,
  buildDir: '.nuxt',
};
let lovelNuxt = false
let testCounter = 0

/*
* Users cloud functions
 */

// exports.resizeMediaToPrefixes = resizeMediaToPrefixes
exports.cleanUsersCollection = cleanUsersCollection

/*
* Media and Storage cloud functions
 */

// When a file is deleted in the main firestore storage
exports.deleteStorageFile = deleteStorageFile

// When a new file is added to the main firestore storage
exports.addStorageFile = addStorageFile

exports.mediaMigrate = mediaMigrate

exports.getMedia = getMedia
exports.resizeFile = resizeFile

exports.changeStorageUsersMediaName = changeStorageUsersMediaName

exports.removePublicUrl = removePublicUrl

exports.saveCoverToUser = saveCoverToUser

exports.formatMediasWithStorage = formatMediasWithStorage
exports.formatMedias = formatMedias

exports.resizeMediaForPrefixes = resizeMediaForPrefixes

exports.ssrapp = functions.https.onRequest(async (req, res) => {
  if (lovelNuxt === false) {
    console.log('Need to start nuxt')
    lovelNuxt = new Nuxt(config);
    await lovelNuxt.ready()
  } else {
    console.log('allready start')
  }
  console.log('request')
  // console.log(req)
  const result = await lovelNuxt.renderRoute(req.path) // Returns { html, error, redirected }

  if (result.error) {
    console.error(result.error)
  }
  if (result.redirected) {
    console.log(result.redirected)
  }
  res.send(result.html)
});

exports.test = functions.https.onRequest(async (req, res) => {
  console.log('test counter ++')
  console.log('request path')
  console.log(req.path)
  testCounter++
  console.log(testCounter)
  res.status(200).send(testCounter + '')
});
