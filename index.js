const functions = require('firebase-functions');
const {Nuxt} = require('nuxt');
const {getMedia, addStorageFile, changeStorageUsersMediaName, formatMediasWithStorage, removePublicUrl, saveCoverToUser, resizeMediaForPrefixes, deleteStorageFile} = require('./Modules/Medias/Firebase/functions')
const {cleanUser} = require('./Modules/Users/Firebase/functions')

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

// exports.resizeMediaToPrefixes = resizeMediaToPrefixes
exports.deleteStorageFile = deleteStorageFile

exports.getMedia = getMedia

exports.changeStorageUsersMediaName = changeStorageUsersMediaName

exports.removePublicUrl = removePublicUrl

exports.saveCoverToUser = saveCoverToUser

exports.cleanUser = cleanUser

exports.formatMediasWithStorage = formatMediasWithStorage

exports.addStorageFile = addStorageFile

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
