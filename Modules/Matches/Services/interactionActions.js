// import trace from "tns-core-modules/trace"
import Database from '@/Modules/DatabasesManager/DatabaseManager'
// import {
//   firestore
// } from 'nativescript-plugin-firebase'
import Interaction from './Interaction'
import Media from '@/Modules/Matches/Services/Match'

export async function loadMatchInteractions ({
  dispatch
}, {
  verbose = true,
  matchPagination = {},
  matchId = false,
  loadChallenges = true,
  FirestoreId = Database.currentId
}) {
  if (verbose) {
    console.log('###############')
    console.log('Start loading Match Interactions')
    // console.log('###############')
    console.log(FirestoreId)
  }
  if (matchId) {
    let interactions = Database.firestores[FirestoreId].collection('matchs').doc(matchId).collection('interactions')
    try {
      let matchInteractions = await dispatch('firestoreLoadEntities', {
        entity: Interaction,
        EntitiesCollections: interactions,
        verbose
      })
      if (matchInteractions) {
        if (matchInteractions.entities) {
          matchInteractions.entities.forEach(async (entity) => {
            console.log(entity)
            if (entity.challengeId) {
              await dispatch('loadChallenge', {
                id: entity.challengeId,
                verbose
              })
            }
            if (entity.replied) {
              let ref = 'interactions'
              let refId = entity.id
              await dispatch('getRefMediasFirebase', {
                verbose,
                refId,
                ref
              })
            }
          })
        }
        if (verbose) {
          console.log('Finish loading Match Interactions')
          console.log('###############')
          // console.log('###############')
        }
        return matchInteractions
      }
    } catch (e) {
      if (verbose) {
        console.error('Error when loading Match ' + matchId + ' interactions ')
        console.error(e)
      }
      throw e
    }
  }
}

export async function adminDeleteMatchInteractions ({dispatch, getters}, {
  matchId,
  verbose = true,
  FirestoreId = Database.currentId
}) {
  if (verbose) {
    console.log('###############')
    console.log('Delete Interactions')
  }
  console.log(matchId)
  let match = getters[FirestoreId + '/matchs/query']()
    .where('id', matchId)
    .with('messages.media')
    .get()[0]
  console.log(match)
  let interactionCollection = Database.firestores[FirestoreId].collection('matchs').doc(matchId).collection('interactions')
  let medias = []
  for (let i = 0; i !== match.messages.length; i++) {
    if (match.messages[i].media !== undefined) {
      for (let j = 0; j !== match.messages[i].media.length; j++) {
        medias.push(match.messages[i].media[j])
      }
    }
  }
  await dispatch('firestoreDeleteEntities', {
    entity: Interaction,
    data: match.messages,
    verbose,
    EntitiesCollections: interactionCollection
  })
  if (medias.length !== 0) {
    if (verbose) {
      console.log('##############')
      console.log('Delete Medias Interactions')
    }
    await dispatch('adminDeleteMedias', {
      entity: Media,
      data: medias,
      verbose,
      FirestoreId
    })
  }
}

export async function startInteractions ({
  dispatch
}, {
  verbose = true,
  challengeId = null,
  fromUserId,
  toUserId,
  matchId
}) {
  let interactions = Database.firestore.collection('matchs').doc(matchId).collection('interactions')
  let inter = await dispatch('firestoreAddEntity', {
    entity: Interaction,
    ignoreFields: ['id', '$id', 'challenge', 'media'],
    EntitiesCollections: interactions,
    verbose,
    data: {
      state: 'choose',
      type: 'challenge',
      matchId,
      fromUserId,
      toUserId,
      challengeId,
      created: firestore.FieldValue.serverTimestamp()
    }
  })
  return inter
}

export async function sendChallenge ({
  dispatch
}, {
  verbose = true,
  matchId = false,
  interactionId,
  challengeId = false,
  fromUserId = false,
  toUserId = false
}) {
  console.log('send Challenge')

  if (interactionId) {
    let interactions = Database.firestore.collection('matchs').doc(matchId).collection('interactions')
    console.log('Interaction ID :')
    console.log(interactionId)
    let inter = await dispatch('firestoreEditEntity', {
      id: interactionId,
      entity: Interaction,
      EntitiesCollections: interactions,
      verbose,
      firestoreMethod: 'update',
      data: {
        state: 'sended',
        challengeId,
        sended: firestore.FieldValue.serverTimestamp()
      },
      preSave: false
    })
    return inter
  } else {
    return await dispatch('startInteractions', {
      verbose,
      fromUserId,
      toUserId,
      challengeId,
      matchId
    })
  }
}

export async function sendChallengeReply ({
  dispatch
}, {
  verbose = true,
  matchId = false,
  interactionId = false
}) {
  let interactions = Database.firestore.collection('matchs').doc(matchId).collection('interactions')
  let inter = await dispatch('firestoreEditEntity', {
    id: interactionId,
    entity: Interaction,
    EntitiesCollections: interactions,
    verbose,
    firestoreMethod: 'update',
    data: {
      state: 'replied',
      replied: firestore.FieldValue.serverTimestamp()
    },
    preSave: false
  })
  return inter
}

export async function sendMessage ({
  dispatch
}, {
  verbose = true,
  matchId = false,
  fromUserId,
  toUserId,
  message = ''
}) {
  let interactions = Database.firestore.collection('matchs').doc(matchId).collection('interactions')
  let messageCallections = await dispatch('firestoreAddEntity', {
    entity: Interaction,
    ignoreFields: ['id', '$id', 'challenge', 'media'],
    EntitiesCollections: interactions,
    verbose,
    data: {
      state: 'sended',
      type: 'message',
      content: message,
      matchId,
      fromUserId,
      toUserId,
      sended: firestore.FieldValue.serverTimestamp(),
      created: new Date()
    }
  })
  return messageCallections
}
