/* eslint-disable import/no-commonjs */
module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: ['airbnb-base'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },

  settings: {
    // Make the import plugin understand .js/.mjs with ESM
    'import/resolver': {
      node: { extensions: ['.js', '.mjs'] },
    },
  },

  rules: {
    // keep MongoDB IDs & version keys without warnings
    'no-underscore-dangle': ['error', {
      allow: ['_id', '__v'],
      allowAfterThis: true,
      allowAfterSuper: true,
      enforceInMethodNames: false,
    }],

    // ESM needs file extensions in imports; silence Airbnb’s preference
    'import/extensions': 'off',

    // Loosen formatting nitpicks that conflict with Prettier/your style
    'object-curly-newline': 'off',

    // keep the rest sane and practical
    'max-len': ['error', {
      code: 110,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'consistent-return': 'off',
    'func-names': 'off',
    'no-console': 'off',
  },
};
