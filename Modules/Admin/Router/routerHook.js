// import { router } from '../main'
import Velocity from 'velocity-animate'
import { isEmpty } from 'lodash'
import authSession from '@/config/Auth'

// Object.defineProperty(Element.prototype, 'documentOffsetTop', {
//   get: function () {
//     return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop : 0)
//   }
// })
// const defaultOptions = {
//   errorRedirect: 'login',
//   successRedirect (user) {}
// }

export default function (router) {
  // let options = {...options.defaultOptions, ...options}
  function isAuthorized (to, from, next) {
    let authorize = false
    let meta = {}
    meta = to.matched.find((m) => {
      // console.log(m.meta.auth)
      return m.meta.auth
    })
    if (typeof meta !== 'undefined') {
      if (authSession.isLogged()) {
        let user = authSession.getData()
        meta.meta.auth.forEach((v) => {
          if (v === user.role) {
            authorize = true
          }
        })
      }
      if (meta.meta.auth[0] === 'all') {
        authorize = true
      }
      if (!authorize) {
        next({name: 'login'})
      } else {
        next()
      }
    } else {
      next()
    }
  }

  function nextReady (redirect) {
    redirect = redirect || true
    if (redirect !== true) {
      router.replace({name: redirect.name})
    }
  }

  router.beforeEach(isAuthorized)

  router.onReady(() => {
    isAuthorized(router.currentRoute, false, nextReady)
  })
  // Add Scroll to the top each time a route is call
  router.afterEach(function (transition) {
    if (isEmpty(transition.hash)) {
      Velocity(document.querySelectorAll('body'), 'scroll', { offset: 0 })
    } else {
      if (transition.hash.charAt(0) === '#' && document.getElementById(transition.hash.slice(1))) {
        let scrollTo = document.getElementById(transition.hash.slice(1))
        Velocity(document.querySelectorAll('body'), 'scroll', { offset: scrollTo.documentOffsetTop })
      }
    }
  })
}
