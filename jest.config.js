module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  roots: [
    '<rootDir>'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.vue$': 'vue-jest'
  },
  collectCoverage: true,
  coverageDirectory: './coverage/jest/',
  coverageReporters: ['json', 'text'],
  collectCoverageFrom: [
    '<rootDir>/**/*.vue',
    '../src/'
  ],
  setupFilesAfterEnv: ['jest-extended/all', "fake-indexeddb/auto"]
}
