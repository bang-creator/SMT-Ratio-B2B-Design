/**
 * Reference Style Dictionary v4 build for the approved DTCG contract.
 * `npm run tokens:build` remains the deterministic project build because it
 * also emits the dark-mode extension and the typed motion module.
 */
export default {
  source: ['docs/design-system/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'output/style-dictionary/',
      files: [{ destination: 'tokens.css', format: 'css/variables' }],
    },
  },
};
