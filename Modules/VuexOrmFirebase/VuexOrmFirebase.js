import Context from './Context'
import FirebaseHook from './Hooks/VuexOrmFirebaseHooks'
import { getCollection } from './Actions/actions'
// import { db } from './firebaseLovelCloud'
// import { getData } from '@/libs/FirebaseUtils'

class FirebaseVuexOrm {
  constructor (components, options) {
    Context.setup(components, options)
    this.setupActions()
    this.setupHooks()
  }
  setupHooks (components, options) {
    const context = Context.getInstance()
    console.log('init hooks')
    this.hooks = new FirebaseHook(context.components, context.options)
  }
  setupActions () {
    const context = Context.getInstance()
    context.components.Actions.getCollection = getCollection
  }
}

export default FirebaseVuexOrm
