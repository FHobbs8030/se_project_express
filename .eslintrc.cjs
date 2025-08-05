const path = require('path');

module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.json'],
        paths: [path.resolve(__dirname)],
      },
    },
  },
  rules: {
    'no-console': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
        packageDir: [__dirname],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'always',
        json: 'always',
        mjs: 'always',
        jsx: 'always',
      },
    ],
  },
};
