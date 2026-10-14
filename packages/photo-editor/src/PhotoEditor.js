import { EventEmitter } from "eventemitter3";
import { getInitialState } from "./getInitialState.js";
import { Tool } from "./Tool/index.js";
import { validateOptions } from "./validateOptions.js";
import { waitForImageComplete } from "./waitForImageComplete.js";

/**
 * @import { PhotoEditorOptions, SourceType } from "./types.js"
 */

/** @type {Partial<PhotoEditorOptions<any, "current-canvas">>} */
const defaultOptions = {
	sourceType: "current-canvas",
};

/**
 * @template {Record<string, typeof Tool>} Tools
 * @template {string & keyof Tools} ToolKey
 * @template {SourceType} [CurrentSource="current-canvas"]
 */
export class PhotoEditor extends EventEmitter {
	/** @type {HTMLCanvasElement | null} */
	_el = null;

	/** @type {PhotoEditorOptions<Tools, CurrentSource> | null} */
	_options = null;

	_currentState = -1;

	/** @type {string[]} */
	_states = [];

	/** @type {ToolKey | null} */
	_enabledToolId = null;

	_touched = false;

	_destroyed = false;

	/** @type {{
		[key in ToolKey]: InstanceType<Tools[key]>;
	}} */
	tools = /** @type {{
		[key in ToolKey]: InstanceType<Tools[key]>;
	}} */ ({});

	/**
	 *
	 * @param {HTMLCanvasElement} el
	 * @param {PhotoEditorOptions<Tools, CurrentSource>} editorOptions
	 */
	constructor(el, editorOptions) {
		super();

		/** @type {PhotoEditorOptions<Tools, CurrentSource>} */
		const options = {
			...defaultOptions,
			...editorOptions,
		};

		if (!(el instanceof HTMLElement) || el.tagName !== "CANVAS") {
			throw new Error("Element for init PhotoEditor should be a canvas");
		}

		validateOptions(options);

		this._el = el;
		this._options = options;

		this._init();
	}

	async _init() {
		if (!this._el) {
			throw new Error("Canvas is not provided");
		}

		if (!this._options) {
			throw new Error("Options are not provided");
		}

		const initialState = await getInitialState(this._el, this._options);

		this._currentState = 0;
		this._states = [initialState];

		if (this._options.sourceType !== "current-canvas") {
			await this._drawCurrentState();
		}

		this._initTools();

		this.emit("ready");
	}

	_initTools() {
		if (!this._el) {
			throw new Error("Canvas is not provided");
		}

		if (!this._options) {
			throw new Error("Options are not provided");
		}

		const { tools } = this._options;

		const el = this._el;

		for (const toolIdRaw of Object.keys(tools)) {
			const toolId = /** @type {ToolKey} */ (toolIdRaw);

			const ToolConstructor = tools[toolId];

			if (typeof ToolConstructor !== "function") {
				throw new Error(
					`PhotoEditor tool "${toolId}": should be a class that extends Tool`,
				);
			}

			const tool = /** @type {InstanceType<Tools[ToolKey]>} */ (
				new ToolConstructor({
					el,
					pushState: this._pushState,
					updateState: this._updateState,
					disable: this.disableTool,
					touch: this.touch,
				})
			);

			if (!(tool instanceof Tool)) {
				throw new Error(
					`PhotoEditor tool "${toolId}": should be an instance of Tool `,
				);
			}

			this.tools[toolId] = tool;
		}
	}

	/**
	 * @param {string} state
	 */
	_pushState = (state) => {
		const slicedStates = this._states.slice(0, this._currentState + 1);
		slicedStates.push(state);

		++this._currentState;
		this._states = slicedStates;
	};

	/**
	 * @param {string} state
	 */
	_updateState = (state) => {
		const slicedStates = this._states.slice(0, this._currentState);
		slicedStates.push(state);

		this._states = slicedStates;
	};

	async _drawCurrentState() {
		// TO DO: test
		const base64 = this.getCurrentState();

		const image = new Image();

		image.src = base64;

		await waitForImageComplete(image);

		if (this._destroyed) {
			return;
		}

		if (!this._el) {
			throw new Error("Canvas is not provided");
		}

		this._el.width = image.naturalWidth;
		this._el.height = image.naturalHeight;

		const ctx = this._el.getContext("2d");

		if (!ctx) {
			throw new Error("Context is not found");
		}

		ctx.drawImage(image, 0, 0);
	}

	destroy() {
		this._destroyed = true;

		for (const toolId of Object.keys(this.tools)) {
			const tool = this.tools[/** @type {ToolKey} */ (toolId)];

			tool.destroy();
		}
	}

	getCurrentState() {
		return this._states[this._currentState];
	}

	/**
	 * @param {ToolKey} toolId
	 */
	enableTool(toolId) {
		if (!this.tools[toolId]) {
			throw new Error(`PhotoEditor tool with id "${toolId}" is not defined`);
		}

		this.disableTool();

		this._enabledToolId = toolId;

		this.tools[toolId].enableFromEditor();

		this.emit("enableTool", toolId);
	}

	disableTool = () => {
		if (this._enabledToolId) {
			this.tools[this._enabledToolId].disableFromEditor();

			this.emit("disableTool", this._enabledToolId);

			if (this._touched) {
				this._drawCurrentState();
			}

			this._touched = false;

			this._enabledToolId = null;
		}
	};

	/**
	 * @param {ToolKey} toolId
	 */
	toggleTool(toolId) {
		if (this._enabledToolId === toolId) {
			this.disableTool();
		} else {
			this.enableTool(toolId);
		}
	}

	touch = () => {
		this._touched = true;
	};

	undo() {
		if (this._currentState > 0) {
			--this._currentState;

			this.disableTool();

			this._drawCurrentState();
		}
	}

	redo() {
		if (this._currentState < this._states.length - 1) {
			++this._currentState;

			this.disableTool();

			this._drawCurrentState();
		}
	}
}
