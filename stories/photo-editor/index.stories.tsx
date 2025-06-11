import type { Meta, StoryObj } from "@storybook/react";

import { PhotoEditor } from "/home/vadim/projects/photo-editor-js/packages/photo-editor";

import { Draw } from "./Draw";
import { Editor } from "./Editor";

const meta: Meta<typeof PhotoEditor> = {
	title: "Photo editor",
	component: PhotoEditor,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PhotoEditor>;

export const DrawStory: Story = {
	name: "Draw",
	args: {},
	render: (props) => <Draw {...props} />,
};

export const EditorStory: Story = {
	name: "Editor",
	args: {},
	render: (props) => <Editor {...props} />,
};
