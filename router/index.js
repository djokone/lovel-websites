import Vue from 'vue';
import Router from 'vue-router';
import adminRoutes from '@/Modules/Admin/Router/routes'
//
Vue.use(Router);
export function createRouter(ssrContext, createDefaultRouter, routerOptions) {
  const options = routerOptions || createDefaultRouter(ssrContext).options;
  let routes = options.routes
  if (ssrContext.target !== 'static') {
    const hostname = ssrContext ? ssrContext.req.headers.host : location.host;
    routes = fixRoutes(options.routes, hostname)
    // console.log('after fix routes')
    // console.log(routes)

  }
  return new Router({
    ...options,
    routes,
  });
}
function fixRoutes(defaultRoutes, hostname) {
  if (hostname.includes('web.lovel')) return website(defaultRoutes);
  if (hostname.includes('admin.lovel')) return manager(defaultRoutes);
  return website(defaultRoutes);
}
// function nubisoftRoutes(defaultRoutes) {
//   return defaultRoutes.filter(r => r.name !== 'subdomain1' && 'subdomain2');
// }
function website(defaultRoutes) {
  const route = defaultRoutes.find(r => r.path.split('/').includes('website'));
  route.path = '/';
  // route.children = route.children.map((r) => {
  //   let name
  //   if (r.name === 'website') {
  //     name = 'home'
  //   } else {
  //     name = r.name.replace('website-', '')
  //   }
  //   return {
  //     ...r,
  //     name
  //   }
  // })
  // console.log(route)
  // console.log(route)
  return [route];
}
function manager(defaultRoutes) {
  const route = defaultRoutes.find(r => r.path.split('/').includes('manager'));
  if (!route) {
    return website(defaultRoutes)
  }
  // console.log('current route')
  // console.log(route)
  // console.log(adminRoutes)
  route.path = '/';

  route.children = [...adminRoutes.admin.children]
  // console.log(route)
  return [route];
}
