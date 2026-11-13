import '../vanilla/design-system.css';

export const globalTypes = {
  theme: {
    description: 'Theme',
    defaultValue: 'dark',
    toolbar: {
      title: 'Theme',
      icon: 'circlehollow',
      items: [
        { value: 'dark', title: 'Dark' },
        { value: 'light', title: 'Light' },
      ],
      dynamicTitle: true,
    },
  },
  brand: {
    description: 'Brand token set',
    defaultValue: 'default',
    toolbar: {
      title: 'Brand',
      icon: 'paintbrush',
      items: [
        { value: 'default', title: 'Default' },
        { value: 'ams-b2b', title: 'AMS B2B' },
      ],
      dynamicTitle: true,
    },
  },
};

export const decorators = [(story, context) => {
  const theme = context.globals.theme || 'dark';
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.dataset.brand = context.globals.brand || 'default';
  return story();
}];

export const parameters = {
  controls: { expanded: true },
  layout: 'padded',
  backgrounds: {
    default: 'dark',
    values: [
      { name: 'dark', value: '#212121' },
      { name: 'light', value: '#ffffff' },
      { name: 'sidebar', value: '#131313' },
    ],
  },
};
