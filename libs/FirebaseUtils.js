export async function getData (ref) {
  let parents = []
  if (ref.size !== 0 && !ref.empty) {
    let i = 0
    try {
      await ref.forEach(async (v) => {
        parents[i] = v.data()
        parents[i]['id'] = v.id
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
