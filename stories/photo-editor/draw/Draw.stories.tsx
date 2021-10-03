import type {
  ComponentStory,
} from '@storybook/react';

import { Draw as DrawComponent } from './Draw';

export default {
  title: 'photo-editor/Draw',
  component: DrawComponent,
};

const Template: ComponentStory<typeof DrawComponent> = (args) => <DrawComponent {...args} />;

export const Draw = Template.bind({});
