import '../vanilla/design-system.css';

export const globalTypes = {
  brand: {
    description: 'Brand token set',
    defaultValue: 'default',
    toolbar: { title: 'Brand', icon: 'paintbrush', items: [{ value: 'default', title: 'Default' }, { value: 'ams-b2b', title: 'AMS B2B' }] },
  },
};

export const decorators = [(story, context) => {
  document.documentElement.dataset.brand = context.globals.brand;
  return story();
}];

export const parameters = { controls: { expanded: true }, layout: 'padded' };
