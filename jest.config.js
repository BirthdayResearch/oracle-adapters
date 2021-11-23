module.exports = {
  preset: 'ts-jest',
  testRegex: '__tests__/.+\\.(e2e|test|spec)\\.ts$',
  moduleNameMapper: {
    '@defichain/salmon-(.*)': '<rootDir>/packages/salmon-$1/src',
    '@defichain/salmon': '<rootDir>/packages/salmon/src'
  },
  verbose: true,
  clearMocks: true,
  testTimeout: 180000,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.*/__tests__/.*'
  ]
}
