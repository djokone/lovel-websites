const admin = require('firebase-admin');
const functions = require('firebase-functions');
exports.cleanUsersCollection = functions
  .runWith({memory: "2GB", timeoutSeconds: 300})
  .https
  .onCall(cleanUsersCollection)

const db = admin.firestore()

/**
 * Remove users that doesn't have created field, used has an utils function
 * @param data
 * @param context
 * @returns {Promise<{renameUsersMedia: []}>}
 */
async function cleanUsersCollection(data, context) {
  const medias = await db.collection('users').get()
  // console.debug(medias)
  let renameUsersMedia = []
  medias.forEach((snapshot) => {
    const media = snapshot.data()
    if (media.created) {
      console.warn(snapshot.id + ' has no storage path.')
      return false
    }
    renameUsersMedia.push({
      id: snapshot.id
    })
  })
  const renameUserMediaPromises = renameUsersMedia.map(async ({id}) => {
    const mediaDoc = db.collection('users').doc(id)
    console.log('Delete user #' + id)
    return mediaDoc.delete()
  })
  await Promise.all(renameUserMediaPromises)
  return {
    renameUsersMedia
  }
}
