module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true
    },
    project: './tsconfig.json'
  },
  rules: {
    'react/no-unescaped-entities': 0,
    '@typescript-eslint/strict-boolean-expressions': 2
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: ['*.config.ts']
}
