import { plugins, vuexModules } from '@/databases'

export default ({ store, req }) => {
  console.log('location.host')
  console.log(location.host)
  if (location.host === 'admin.lovel') {
    for (let plugin of plugins) {
      // console.log('Add')
      plugin(store)
      }
      console.log('route : ')
    // const hostname = req.headers.host;
    //   console.log(hostname)
    //   console.log(location.host)
      for (let key in vuexModules) {
        // console.log('register module : ' + key)
        store.registerModule(key, vuexModules[key])
      // store.register()
      // plugi(store);
    }
  }
};
