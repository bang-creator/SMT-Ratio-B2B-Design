export default {
  stories: ['../vanilla/**/*.stories.js'],
  staticDirs: [{ from: '../vanilla/assets', to: '/assets' }],
  addons: [],
  framework: { name: '@storybook/html-vite', options: {} },
};
