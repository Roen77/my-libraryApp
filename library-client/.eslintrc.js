module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'cypress/globals': true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'cypress'
  ],
  rules: {
    'vue/html-self-closing': 'off',
    'no-console': 'off',
    'vue/require-default-prop': 'off'
  }
}
