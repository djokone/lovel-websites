import { db } from '@/config/firebaseLovelCloud'

export function getAllSettings () {
  return db.runTransaction(function (transaction) {

  })
}
