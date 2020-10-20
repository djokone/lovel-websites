import { db } from '@/config/firebaseLovelCloud'


export async function getSettings ({ dispatch }, data = 'all') {
  let settings = db.collection('/settings/')
  let res
  if (data === 'all') {
    res = await settings.get()
    res = await getData(res)
    dispatch('entities/settings/insert', {
      data: res
    })
    return res
  } else {
    res = await settings.doc(data).get()
    dispatch('entities/settings/insert', {
      data: res
    })
    console.log(res.data())
    return res
  }
}

async function getData (ref, callback = false) {
  let parents = []
  if (ref.size !== 0 && !ref.empty) {
    let i = 0
    try {
      await ref.forEach(async (v) => {
        parents[i] = v.data()
        parents[i]['id'] = v.id
        if (callback) {
          callback(ref, i, parents)
        }
        i++
      })
    } catch (e) {
      console.log(e)
    }
    return parents
  } else {
    return false
  }
}
