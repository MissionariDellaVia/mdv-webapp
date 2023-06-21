const { defineConfig } = require('@vue/cli-service')
const SitemapPlugin = require('sitemap-webpack-plugin').default
// You can write the paths as an array of strings or an array of objects
const paths = [
  {
    path: '/',
    lastmod: '2023-06-13',
    priority: 1.0,
    changefreq: 'yearly'
  },
  {
    path: '/vocazione',
    lastmod: '2023-06-13',
    priority: 0.6,
    changefreq: 'yearly'
  },
  {
    path: '/approfondimenti',
    lastmod: '2023-06-13',
    priority: 0.6,
    changefreq: 'yearly'
  },
  {
    path: '/prega-con-noi',
    lastmod: '2023-06-13',
    priority: 0.7,
    changefreq: 'yearly'
  },
  {
    path: '/attivita',
    lastmod: '2023-06-13',
    priority: 1.0,
    changefreq: 'monthly'
  },
  {
    path: '/contatti',
    lastmod: '2023-06-13',
    priority: 0.9,
    changefreq: 'yearly'
  }
]

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
      ? '/'
      : '/mdv-webapp/',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new SitemapPlugin({ base: 'https://www.missionaridellavia.net/#', paths })
    ]
  },
})
