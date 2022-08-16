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
        'class-methods-use-this': 'off',
        'import/prefer-default-export': 'off',
        'no-shadow': 'off',
        'no-useless-constructor': 'off',
        'no-empty-function': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'no-restricted-syntax': 'off',
        'max-classes-per-file': 'off',
        'no-return-await': 'off',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
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
