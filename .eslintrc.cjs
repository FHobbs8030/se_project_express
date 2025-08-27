module.exports = {
  extends: ['airbnb-base'],
  env: { node: true, es2021: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/extensions': ['error', 'ignorePackages', { js: 'always', mjs: 'always' }],
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',

    // ← turn off console complaints
    'no-console': 'off',
  },
};
