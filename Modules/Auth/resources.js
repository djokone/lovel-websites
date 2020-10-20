// import bootstrap from '/bootstrap'
// import axios from 'axios'
// import auth from '/authConfig'
//
// var url = axios.create({
//   baseURL: process.env.CONFIG.SERVEUR,
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   }
// })
// var api = axios.create({
//   baseURL: process.env.CONFIG.SERVEUR + '/api',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   }
// })
//
// var admin = axios.create({
//   baseURL: process.env.CONFIG.SERVEUR + '/api/admin',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   }
// })
// var rev = axios.create({
//   baseURL: process.env.CONFIG.SERVEUR + '/api/rev',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   }
// })
// function intercept (axiosUrl) {
//   axiosUrl.interceptors.request.use(function (config) {
//     if (auth.isLogged()) {
//       if (bootstrap.authorizationType === 'url') {
//         config.url = config.url + '?token=' + auth.getToken()
//       } else {
//         config.headers.common['Authorization'] = 'Bearer ' + auth.getToken()
//       }
//     }
//     return config
//   }, function (error) {
//     console.log(error)
//     // Do something with request error
//     return Promise.reject(error)
//   })
// }
//
// intercept(api)
// intercept(admin)
// intercept(rev)
//
// export {api, url, admin, rev}
