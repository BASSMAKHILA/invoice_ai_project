module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // Support React
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    // Désactivation des règles Next.js inutiles
    '@next/next/no-img-element': 'off',
    // Bonnes pratiques React
    'react/prop-types': 'off', // à activer si tu veux forcer les PropTypes
    'react/react-in-jsx-scope': 'off', // inutile avec React 17+
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
