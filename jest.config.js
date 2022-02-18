module.exports = {
  globals: {
    __DEV__: false,
    __FIEND_DEV__: false,
  },
  roots: ['<rootDir>/src/'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '(\\.(test))\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coverageDirectory: '<rootDir>/coverage~~',
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testEnvironment: 'jsdom',
}
