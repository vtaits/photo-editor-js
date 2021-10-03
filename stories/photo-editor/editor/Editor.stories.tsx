import type {
  ComponentStory,
} from '@storybook/react';

import { Editor as EditorComponent } from './Editor';

export default {
  title: 'photo-editor/Editor',
  component: EditorComponent,
};

const Template: ComponentStory<typeof EditorComponent> = (args) => <EditorComponent {...args} />;

export const Editor = Template.bind({});
