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
  coverageDirectory: './jest-coverage',
  coverageReporters: ['json', 'text'],
  collectCoverageFrom: [
    '<rootDir>/**/*.vue',
    '../src/'
  ],
  testURL: 'https://tester.auth0.com/login?state=hK1a11WA&code=123456789',
  setupFiles: ['jest-localstorage-mock'],
  setupFilesAfterEnv: ['jest-extended']
}
