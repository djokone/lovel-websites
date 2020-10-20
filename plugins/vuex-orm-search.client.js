import VuexORMSearch from "@vuex-orm/plugin-search";
import VuexORM from '@vuex-orm/core'

/**
 * Use VuexORM Search Engine
 */
export default function () {
  VuexORM.use(VuexORMSearch, {
    // verbose: process.env.NODE_ENV !== 'production'
  });
  console.log('Init vuex orm Search for ')
}
