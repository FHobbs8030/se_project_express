module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': 'off',
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    'no-useless-escape': 'off',
  },
};
