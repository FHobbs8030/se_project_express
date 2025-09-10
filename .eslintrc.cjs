module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: ['airbnb-base'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: {
    'import/resolver': { node: { extensions: ['.js', '.mjs', '.json'] } },
  },
  rules: {
    'max-len': ['error', {
      code: 100,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'consistent-return': 'off',
    'func-names': ['error', 'as-needed'],
    'no-param-reassign': ['error', { props: false }],
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],
    'object-curly-newline': 'off',
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
  },
};
