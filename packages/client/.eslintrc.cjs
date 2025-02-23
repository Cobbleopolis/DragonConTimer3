/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: ['warn', 4],
        'linebreak-style': ['warn', 'unix'],
        quotes: ['warn', 'single'],
        semi: ['warn', 'never'],
        'no-unused-vars': ['warn']
    },
}
