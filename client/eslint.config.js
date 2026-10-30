import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'dist/**', '*.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        browser: true,
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly'
      }
    },
    settings: {
      react: {
        version: '18.2'
      }
    },
    plugins: {
      react
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error'
    }
  }
];