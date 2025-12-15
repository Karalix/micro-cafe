// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // Your custom configs here
  rules: {
    '@stylistic/quotes': ['error', 'single'],
  },
}).overrideRules({
  'vue/max-attributes-per-line': ['warn', { singleline: 3 }],
})
