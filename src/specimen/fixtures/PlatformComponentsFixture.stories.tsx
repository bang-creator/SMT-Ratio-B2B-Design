import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlatformComponentsFixture } from './PlatformComponentsFixture';

const meta = { title: 'Fixtures/Platform components', component: PlatformComponentsFixture, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof PlatformComponentsFixture>;
export default meta;
type Story = StoryObj<typeof meta>;
export const UsageAndResponses: Story = {};
