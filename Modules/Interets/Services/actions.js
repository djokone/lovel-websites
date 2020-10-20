import {
  db
} from '@/config/firebaseLovelCloud'
import {
  getData
} from '@/libs/FirebaseUtils'
import Interest from '@/Modules/Interets/Services/Interest'
import InterestTag from '@/Modules/Interets/Services/InterestTag'
import Database from '@/Modules/DatabasesManager/DatabaseManager'

/**
 * Admin Firestore Load center of interests
 * @param dispatch
 * @param params
 * @returns {Promise<*>}
 **/
export async function adminFirestoreLoadInterests ({
  dispatch,
  getters
}, params) {
  let defaultParams = {
    entity: Interest,
    lasyLoad: true,
    verbose: getters.debug,
    collection: 'interests',
    FirestoreId: Database.currentId
  }
  params = Object.assign({}, defaultParams, params)
  console.log(params)
  return await dispatch('firestoreLoadEntities', params)
}

export async function adminFirestoreLoadInterest ({
  dispatch,
  getters
}, params) {
  let defaultParams = {
    id: false,
    entity: Interest,
    verbose: getters.debug,
    lasyLoad: false,
    collection: 'interests',
    FirestoreId: Database.currentId,
    loadParent: false,
    loadTags: false
  }
  params = Object.assign({}, defaultParams, params)
  dispatch('adminLoadInterestTags', {
    interestId: params.id,
    verbose: params.verbose
  })
  return await dispatch('firestoreLoadEntity', params)
  // if (loadParent) {
  //   if (load.parent_id) {
  //     dispatch('AdminFirestoreLoadInterest', {
  //       id: load.parent_id,
  //       loadTags,
  //       loadParent
  //     })
  //   }
  // let parents = await InterestCollection.doc(InterestDoc.data().parent_id).get()
  // let parentsArray = []
  // console.log(parents.data())
  // parents.forEach((doc) => {
  //   parentsArray.push({
  //     id: doc.id,
  //     ...doc.data()
  //   })
  // })
  // Interest.insertOrUpdate({
  //   data: []
  // })
  // console.log(parentsArray)
  // }
  // if (InterestDoc.exists) {
  //   let save = {data: load}
  //   if (insertOrUpdate.length) {
  //     save['insertOrUpdate'] = insertOrUpdate
  //   }
  //   Interest.insertOrUpdate(save)
  //   return load
  // }
}
export async function adminLoadInterestTags ({
  dispatch,
  getters
}, {
  interestId,
  entity = InterestTag,
  verbose = getters.debug,
  lazyLoad = true
}) {
  let where = [
    ['interest_id', '==', interestId]
  ]
  let query = await dispatch('firestoreLoadEntities', {
    where,
    entity,
    verbose: false,
    lazyLoad
  })
  let interestTags = query.localDatabase
  for (let Tag of interestTags) {
    dispatch('adminFirestoreLoadTag', {
      verbose,
      id: Tag.tag_id
    })
    console.log(Tag)
  }
  // let InterestTagCollection = db.collection('/interestTag/')
  // let InterestTags = await InterestTagCollection.where('interest_id', '==', interest_id).get()
  // let belongsTags = []
  // if (!InterestTags.empty) {
  //   await InterestTags.forEach(async (doc) => {
  //     let belongsInterestTag = {id: doc.id, ...doc.data()}
  //     let tag = await dispatch('adminFirestoreLoadTag', {
  //       id: doc.data().tag_id
  //     })
  //     InterestTag.insertOrUpdate({
  //       data: [
  //         belongsInterestTag
  //       ]
  //     })
  //     belongsTags.push(tag)
  //   })
  // } else {
  //   return false
  // }
  // return belongsTags
}

export async function adminFirestoreAddInterest ({
  dispatch
}, {
  data,
  verbose = true,
  entity = Interest,
  ignoreFields = ['id', '$id']
}) {
  if (data['parent_id'] && data['parent_id'].length > 0) {
    data['parent_id'] = data['parent_id'][0]
  }
  // let InterestCollection = await firebase.firestore().collection('interests')
  // let interestAdded = await InterestCollection.add(data)
  // let interest = await interestAdded.get()
  // data['id'] = interest.id
  // return await dispatch('entities/interests/insert', {
  //   data
  // })""
  return await dispatch('firestoreAddEntity', {
    verbose,
    entity: Interest,
    data,
    ignoreFields
  })
  // let subInteret = await dispatch('getFirestoreSubInterets', {
  //   interests,
  //   Interest
  // })
  // console.log(subInteret)
}

export async function adminEditInterests ({
  dispatch
}, {
  id,
  toSave,
  verbose,
  ignoreFields = ['$id', 'id', 'childrens', 'tags', 'parent']
}) {
  console.log('start edit challenge')
  let response = await dispatch('firestoreEditEntity', {
    id,
    verbose,
    entity: Interest,
    data: toSave,
    ignoreFields
  })
  return response
}

/**
 * Remove Insterest for administration
 * @param dispatch Vuex Store
 * @param id
 * @param verbose
 * @param entity
 * @returns {Promise<*>}
 */
export async function adminRemoveInterest ({
  dispatch,
  getters
}, {
  id,
  verbose = getters.debug,
  entity = Interest
}) {
  return dispatch('firestoreDeleteEntity', {
    id,
    verbose,
    entity
  })
}
export async function adminDeleteTagToInterest ({
  dispatch,
  getters
}, {
  interestId,
  tagId,
  removeTagAuto = false,
  verbose = getters.debug
}) {
  let where = [
    ['tag_id', '==', tagId]
  ]
  let interestTagsEntities = await dispatch('firestoreLoadEntities', {
    entity: InterestTag,
    where,
    verbose
  })
  let isLastInterestTags = interestTagsEntities.localDatabase.length === 1
  if (isLastInterestTags) {
    dispatch('adminFirestoreDeleteTag', {
      verbose,
      id: interestTagsEntities.localDatabase[0].tag_id
    })
  }
  let toDelete = interestTagsEntities.localDatabase.filter((v) => {
    return v.tag_id === tagId && v.interest_id === interestId
  })
  dispatch('firestoreDeleteEntity', {
    entity: InterestTag,
    verbose,
    id: toDelete[0].id
  })
  console.log(interestTagsEntities)
  // console.log(interest_id, tag_id, removeTagAuto)
  // let link = await interestTag.where('tag_id', '==', tag_id).where('interest_id', '==', interest_id).get()
  // let id = link.docs[0].id
  // await interestTag.doc(id).delete()
  // dispatch('entities/interestTag/delete', id)
  // console.log(link.size)
  // if (removeTagAuto) {
  //   let linkLeft = await interestTag.where('tag_id', '==', tag_id).get()
  //   console.log(linkLeft)
  //   if (linkLeft.size === 0) {
  //     dispatch('adminFirestoreDeleteTag', {id: tag_id})
  //   }
  // }
}

export async function getFirestoreSubInterets (store, data) {
  console.log(data)
  let res = []
  await data.Interest.forEach(async (v, k) => {
    let inter = await db.collection('/interests/' + v.id).get()
    console.log(inter)
    res[k] = v
    res[k]['parents'] = await getData(inter)
    console.log(k)
    console.log(inter)
  })
  console.log(res)
  // let subInterets = await.collection('/Interests').doc()
}

// async function getDataWithParents (ref) {
//   let parents = []
//   console.log(ref)
//   if (ref.size !== 0 && !ref.empty) {
//     let i = 0
//     try {
//       await ref.forEach(async (v) => {
//         let parentsR = v.ref.parent.get()
//         console.log(v.ref)
//         console.log(await parentsR)
//         await parentsR.forEach(async (k) => {
//           console.log(k.data())
//         })
//         parents[i] = v.data()
//         if (parentsR.size) {
//           let parentR = await getDataWithParents(await parentsR)
//           console.log(parentR)
//           console.log(parentR)
//           // console.log(parentR)
//           // parents[i]['parents'] = parentR
//         }
//         i++
//       })
//     } catch (e) {
//       console.log(e)
//     }
//     return parents
//   } else {
//     return false
//   }
// }
