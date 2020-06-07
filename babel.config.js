module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ],
  plugins: [
    ['transform-imports', {
      vuetify: {
        //        'transform': 'vuetify/es5/components/',
        transform: 'vuetify/es5/components/${member}', // eslint-disable-line no-template-curly-in-string
        preventFullImport: false
      }
    }]
    // ['istanbul']
  ]
}
