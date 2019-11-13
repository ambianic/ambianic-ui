// Compress static text assets at build time
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  'pwa' : {
    'name' : 'Ambianic UI',
    'themeColor' : '#179aff',
    'msTileColor' : '#179aff',
    'appleMobileWebAppCapable' : 'yes',
    'workboxPluginMode' : 'GenerateSW',
    'workboxOptions' : {
      'runtimeCaching' : [ {
        'urlPattern' :
            new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
        'handler' : 'CacheFirst',
        'options' : {
          'cacheName' : 'google-fonts',
          'expiration' : {'maxEntries' : 30},
          'cacheableResponse' : {'statuses' : [ 0, 200 ]}
        }
      } ]
    }
  },

  'transpileDependencies' : [ 'vuetify' ],

  chainWebpack(config) {
    // Improve first page loading time
    // ref:
    // https://medium.com/@aetherus.zhou/vue-cli-3-performance-optimization-55316dcd491c
    config.plugins.delete('prefetch');

    // enable build time compression
    config.plugin('CompressionPlugin').use(CompressionPlugin);
  },

  productionSourceMap : false
}
