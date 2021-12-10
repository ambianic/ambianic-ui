module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/strongly-recommended'
  ],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off'
  },

  parserOptions: {
    parser: '@babel/eslint-parser'
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    },
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    },
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
