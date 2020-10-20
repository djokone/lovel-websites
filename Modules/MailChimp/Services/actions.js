// import Mailchimp from 'mailchimp-api-v3'
// let mail = new Mailchimp('fce04bc9a17ff96e2cc7c885380c2dbf-us18')
// console.log(mail)
export async function initializeMailchimp ({ dispatch }, instance = false) {
  let setting = await dispatch('getSettings', 'mailchimp')
  return instance === false ? {setting} : instance
}

export async function getLists ({ dispatch }, query = {}) {
  console.log('getList')
  await dispatch('initializeMailchimp')
}
