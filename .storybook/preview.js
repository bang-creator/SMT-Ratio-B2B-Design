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
  options: {
    storySort: (a, b) => {
      const aTitle = a.title || '';
      const bTitle = b.title || '';
      if (aTitle === bTitle) return 0;

      const aParts = aTitle.split('/').map((s) => s.trim());
      const bParts = bTitle.split('/').map((s) => s.trim());

      const aTop = aParts[0] || '';
      const bTop = bParts[0] || '';
      if (aTop !== bTop) return aTop.localeCompare(bTop);

      const aCat = aParts[1] || '';
      const bCat = bParts[1] || '';
      if (aCat !== bCat) {
        if (aCat === 'Shared') return -1;
        if (bCat === 'Shared') return 1;
        return aCat.localeCompare(bCat);
      }

      const aComp = aParts[2] || '';
      const bComp = bParts[2] || '';

      const aNumMatch = aComp.match(/^(\d+)/);
      const bNumMatch = bComp.match(/^(\d+)/);

      if (aNumMatch && bNumMatch) {
        const aNum = parseInt(aNumMatch[1], 10);
        const bNum = parseInt(bNumMatch[1], 10);
        if (aNum !== bNum) return aNum - bNum;
      }

      return aComp.localeCompare(bComp, undefined, { numeric: true, sensitivity: 'base' });
    },
  },
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
