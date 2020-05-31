module.exports = {
  verbose: true,
  moduleNameMapper: {
    "module_name_(.*)": "<rootDir>/src/$1"
  },
  moduleFileExtensions: [
      "js",
      "json",
      "vue"
  ],
  transform: {
      ".*\\.(vue)$": "vue-jest",
      "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
  },
  collectCoverage: true,
  collectCoverageFrom: [
      "src\\*.{js,vue}",
      "!**/node_modules/**"
  ],
  coverageReporters: [
      "html",
      "text-summary"
  ],
  preset: '@vue/cli-plugin-unit-jest'
}
