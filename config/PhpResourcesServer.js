import Server from '@/Modules/Servers'

export const lovelAppPhpServer = new Server({
  server: process.env.SERVEUR
  // server: 'http://lovel.app/'
})

// export lovelAppPhpServer
