
module.exports = {
  globals: {
    __DEV__: false
  },
  roots: ['<rootDir>/src/'],
  transform: {
    '.(ts|tsx)': 'ts-jest'
  },
  testRegex: '(\\.(test))\\.(ts|tsx)$',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  coverageDirectory: '<rootDir>/coverage~~',
  collectCoverageFrom: ['app/**/*.{ts,tsx,js}']
}
