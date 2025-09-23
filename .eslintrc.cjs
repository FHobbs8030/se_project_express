/* eslint-disable import/no-commonjs */
module.exports = {
  root: true,
  env: { node: true, commonjs: true, es2021: true },

  extends: ['airbnb-base'],

  // CommonJS backend (allow require/module.exports)
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'script',
  },

  rules: {
    // allow Mongo-style fields
    'no-underscore-dangle': ['error', {
      allow: ['_id', '__v'],
      allowAfterThis: true,
      allowAfterSuper: true,
      enforceInMethodNames: false,
    }],

    // practical relaxations
    'import/extensions': 'off',
    'object-curly-newline': 'off',
    'max-len': ['error', {
      code: 110,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'consistent-return': 'off',
    'func-names': 'off',
    'no-console': 'off',

    // silence warnings about using CommonJS in Node
    'import/no-commonjs': 'off',
  },
};
