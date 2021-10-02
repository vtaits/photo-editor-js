module.exports = {
  root: true,

  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  plugins: [
    'jest',
    '@typescript-eslint',
  ],

  parserOptions: {
    project: './tsconfig.validate.json',
  },

  settings: {
    'import/resolver': {
      typescript: {},
    },
  },

  rules: {
    'arrow-parens': ['error', 'always'],
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',

    'no-underscore-dangle': ['error', { allowAfterThis: true }],

    'no-restricted-syntax': [
      'error',
      { selector: 'MethodDefinition[kind="set"]', message: 'Property setters are not allowed' },
      { selector: 'MethodDefinition[kind="get"]', message: 'Property getters are not allowed' },
    ],

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/__tests__/**/*',
          '**/__stories__/**/*',
        ],
      },
    ],

    'import/prefer-default-export': 'off',

    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
