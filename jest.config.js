module.exports = {
  preset: 'ts-jest',
  testRegex: '((\\.|/)(e2e|test|spec))\\.ts$',
  moduleNameMapper: {
    '@defichain/salmon': '<rootDir>/packages/salmon/src',
    '@defichain/salmon-(.*)': '<rootDir>/packages/salmon-$1/src'
  },
  verbose: true,
  clearMocks: true,
  testTimeout: 180000,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.*/__tests__/.*'
  ]
}
