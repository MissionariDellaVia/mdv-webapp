const { defineConfig } = require('@vue/cli-service')
const SitemapPlugin = require('sitemap-webpack-plugin').default
const { rotteDaPubblicare } = require('./src/router/instradamento')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
      ? '/'
      : '/mdv-webapp/',
  transpileDependencies: true,
  devServer: {
    port: 9191
  },
  configureWebpack: {
    plugins: [
      // La base non contiene il cancelletto: nelle sitemap i frammenti
      // non sono ammessi e il plugin li scartava comunque, producendo
      // indirizzi che sul server rimandano alla pagina di errore.
      // Quali rotte dichiarare lo decide instradamento.js, insieme alla
      // modalita' del router: le due non possono divergere.
      new SitemapPlugin({
        base: 'https://www.missionaridellavia.net',
        paths: rotteDaPubblicare(),
      })
    ]
  },
})
