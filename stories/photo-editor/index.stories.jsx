import { PhotoEditor } from "../../packages/photo-editor/src/PhotoEditor.js";
import { Draw } from "./Draw/index.jsx";
import { Editor } from "./Editor/index.jsx";

/**
 * @import { Meta, StoryObj } from "@storybook/react-vite"
 */

/**
 * @type {Meta<typeof PhotoEditor>}
 */
const meta = {
	title: "Photo editor",
	tags: ["autodocs"],
};

export default meta;

/**
 * @typedef {StoryObj<typeof PhotoEditor>} Story
 */

/** @type {Story} */
export const DrawStory = {
	name: "Draw",
	args: {},
	render: () => <Draw />,
};

/** @type {Story} */
export const EditorStory = {
	name: "Editor",
	args: {},
	render: () => <Editor />,
};
