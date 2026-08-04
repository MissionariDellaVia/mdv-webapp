const { defineConfig } = require('@vue/cli-service')
const SitemapPlugin = require('sitemap-webpack-plugin').default
const paths = [
  {
    path: '/',
    lastmod: '2023-06-13',
    priority: 1.0,
    changefreq: 'yearly'
  },
  {
    path: '/vocazione',
    lastmod: '2026-08-04',
    priority: 0.9,
    changefreq: 'yearly'
  },
  {
    path: '/vocazione/discernimento',
    lastmod: '2026-08-04',
    priority: 0.8,
    changefreq: 'yearly'
  },
  {
    path: '/vocazione/matrimonio',
    lastmod: '2026-08-04',
    priority: 0.8,
    changefreq: 'yearly'
  },
  {
    path: '/vocazione/sacerdozio',
    lastmod: '2026-08-04',
    priority: 0.8,
    changefreq: 'yearly'
  },
  {
    path: '/vocazione/vita-consacrata',
    lastmod: '2026-08-04',
    priority: 0.8,
    changefreq: 'yearly'
  },
  {
    path: '/vocazione/domande',
    lastmod: '2026-08-04',
    priority: 0.7,
    changefreq: 'monthly'
  },
  {
    path: '/vocazione/proposta',
    lastmod: '2026-08-04',
    priority: 0.7,
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
  devServer: {
    port: 9191
  },
  configureWebpack: {
    plugins: [
      new SitemapPlugin({ base: 'https://www.missionaridellavia.net/#', paths })
    ]
  },
})
