module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'jsx-a11y'],
    extends: [
      'airbnb',
      'airbnb-typescript',
      'airbnb/hooks',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:jsx-a11y/recommended',
      'prettier'
    ],
    env: {
      browser: true,
      node: true,
      es2021: true
    },
    parserOptions: {
      project: './tsconfig.json'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  };