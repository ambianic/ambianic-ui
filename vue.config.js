// Compress static text assets at build time
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000
      }
    },
    plugins: [
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, 'dist'),
        // Required - Routes to render.
        routes: [
          '/',
          '/about',
          '/edge-connect',
          '/feedback',
          '/help',
          '/people',
          '/settings',
          '/timeline'
        ],
        minify: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          keepClosingSlash: true,
          sortAttributes: true
        }
      })
    ]
  },
  pwa: {
    name: 'Ambianic  UI',
    themeColor: '#179aff',
    msTileColor: '#179aff',
    appleMobileWebAppCapable: 'yes',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    },
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      exclude: [/\.map$/, /_redirects/],
      runtimeCaching: [
        {
          urlPattern: new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 30
            },
            cacheableResponse: {
              statuses: [
                0,
                200
              ]
            }
          }
        }
      ]
    }
  },

  transpileDependencies: [
    'vuetify'
  ],

  chainWebpack (config) {
    // Improve first page loading time
    // ref: https://medium.com/@aetherus.zhou/vue-cli-3-performance-optimization-55316dcd491c
    config.plugins.delete('prefetch')

    // enable build time compression
    config.plugin('CompressionPlugin').use(CompressionPlugin)
    // bundle build analyzer
    config.plugin('BundleAnalyzerPlugin').use(BundleAnalyzerPlugin)
  },

  productionSourceMap: false
}
