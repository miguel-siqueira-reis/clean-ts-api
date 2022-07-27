module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      ts: true,
    },
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    camelcase: 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'no-shadow': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
      },
    ],
  },
};

// 'import-helpers/order-imports': [
//   'warn',
//   {
//     'newlines-between': 'always',
//     groups: ['module', '/^@shared/', ['parent', 'sibling', 'index']],
//     alphabetize: { order: 'asc', ignoreCase: true },
//   },
// ],
