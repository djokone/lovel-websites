// import fs from "fs-extra"
const fs = require('fs-extra')
const path = require('path')
// import path from "path"

module.exports = {
  env: {
    SERVEUR: 'lovel.app'
  },
  hooks: {
    build: {
      done (builder) {
        if (process.env.node_env === 'production') {
          console.log('i Copy static files')
          let staticFolder = path.resolve(__dirname, './static')
          let staticDist = path.resolve(__dirname, './.nuxt/dist/client')
          fs.copy(staticFolder, staticDist).then(() => {
            console.log(staticFolder + ' was copied to ' + staticDist);
          }).catch(console.error)

        }
      }
    }
  },
  server: {
    port: 80
  },
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  mode: 'universal',
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  // loadingIndicator: {
  //   name: 'circle',
  //   color: '#3B8070',
  //   background: 'white'
  // },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    [
      '@nuxtjs/router',
      {
        path: 'router',
        fileName: 'index.js',
        keepDefaultRouter: true,
      },
    ],
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    sass: ['~/bourbon/core', '~bourbon-neat/core/neat']
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/element-ui',
    // '@/plugins/vuex-orm',
    // '@/plugins/vuex-orm-search.client.js',
    // '@/plugins/databases-manager.client.js'
  ],
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    // transpile: [/^element-ui/],
    publicPath: process.env.node_env === 'production' ? '/' : '/_nuxt/',
    extractCss: true,
    babel: {
      presets: ({ isServer }) => [
        [
          '@nuxt/babel-preset-app',
          {
            targets: isServer
              ? { node: '12.7.0' }
              : { browsers: ['defaults'] },
          }
        ]
      ]
    }
    // extend(config, { isClient }) {
    //   // console.log(config.module.rules[0])
    //   // let sass = config.module.rules[0].options.loaders.scss.find(e => e.load === 'sass-loader')
    //   // Object.assign(sass.options, {
    //   //   includePaths: ['~/bourbon/core', '~/bourbon-neat/core/neat']
    //   // })
    //   // Extend only webpack config for client-bundle
    //   console.log('webpack css config')
    //   // console.log(config)
    //   // if (isClient) {
    //   //   config.devtool = 'source-map'
    //   // }
    // }
    // transpile: [/^@vuex-orm\/plugin-search/]
    // transpile: [/^element-ui/],
  }
}
