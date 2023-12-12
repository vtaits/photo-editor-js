import { EventEmitter } from "eventemitter3";

import { Tool } from "./Tool";
import { getInitialState } from "./getInitialState";
import { validateOptions } from "./validateOptions";
import { waitForImageComplete } from "./waitForImageComplete";

import type { PhotoEditorOptions, SourceType } from "./types";

// biome-ignore lint/suspicious/noExplicitAny: options for any type of tools
const defaultOptions: Partial<PhotoEditorOptions<any, "current-canvas">> = {
	sourceType: "current-canvas",
};

export class PhotoEditor<
	Tools extends Record<string, typeof Tool>,
	ToolKey extends string & keyof Tools,
	CurrentSource extends SourceType = "current-canvas",
> extends EventEmitter {
	_el: HTMLCanvasElement | null = null;

	_options: PhotoEditorOptions<Tools, CurrentSource> | null = null;

	_currentState = -1;

	_states: string[] = [];

	_enabledToolId: ToolKey | null = null;

	_touched = false;

	_destroyed = false;

	tools: {
		[key in ToolKey]: InstanceType<Tools[key]>;
	} = {} as {
		[key in ToolKey]: InstanceType<Tools[key]>;
	};

	constructor(
		el: HTMLCanvasElement,
		editorOptions: PhotoEditorOptions<Tools, CurrentSource>,
	) {
		super();

		const options: PhotoEditorOptions<Tools, CurrentSource> = {
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

	async _init(): Promise<void> {
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

	_initTools(): void {
		if (!this._el) {
			throw new Error("Canvas is not provided");
		}

		if (!this._options) {
			throw new Error("Options are not provided");
		}

		const { tools } = this._options;

		const el = this._el;

		for (const toolIdRaw of Object.keys(tools)) {
			const toolId = toolIdRaw as ToolKey;

			const ToolConstructor = tools[toolId];

			if (typeof ToolConstructor !== "function") {
				throw new Error(
					`PhotoEditor tool "${toolId}": should be a class that extends Tool`,
				);
			}

			const tool = new ToolConstructor({
				el,
				pushState: this._pushState,
				updateState: this._updateState,
				disable: this.disableTool,
				touch: this.touch,
			}) as InstanceType<Tools[ToolKey]>;

			if (!(tool instanceof Tool)) {
				throw new Error(
					`PhotoEditor tool "${toolId}": should be an instance of Tool `,
				);
			}

			this.tools[toolId] = tool;
		}
	}

	_pushState = (state: string): void => {
		const slicedStates = this._states.slice(0, this._currentState + 1);
		slicedStates.push(state);

		++this._currentState;
		this._states = slicedStates;
	};

	_updateState = (state: string): void => {
		const slicedStates = this._states.slice(0, this._currentState);
		slicedStates.push(state);

		this._states = slicedStates;
	};

	async _drawCurrentState(): Promise<void> {
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

	destroy(): void {
		this._destroyed = true;

		for (const toolId of Object.keys(this.tools)) {
			const tool = this.tools[toolId as ToolKey];

			tool.destroy();
		}
	}

	getCurrentState(): string {
		return this._states[this._currentState];
	}

	enableTool(toolId: ToolKey): void {
		if (!this.tools[toolId]) {
			throw new Error(`PhotoEditor tool with id "${toolId}" is not defined`);
		}

		this.disableTool();

		this._enabledToolId = toolId;

		this.tools[toolId].enableFromEditor();

		this.emit("enableTool", toolId);
	}

	disableTool(): void {
		if (this._enabledToolId) {
			this.tools[this._enabledToolId].disableFromEditor();

			this.emit("disableTool", this._enabledToolId);

			if (this._touched) {
				this._drawCurrentState();
			}

			this._touched = false;

			this._enabledToolId = null;
		}
	}

	toggleTool(toolId: ToolKey): void {
		if (this._enabledToolId === toolId) {
			this.disableTool();
		} else {
			this.enableTool(toolId);
		}
	}

	touch(): void {
		this._touched = true;
	}

	undo(): void {
		if (this._currentState > 0) {
			--this._currentState;

			this.disableTool();

			this._drawCurrentState();
		}
	}

	redo(): void {
		if (this._currentState < this._states.length - 1) {
			++this._currentState;

			this.disableTool();

			this._drawCurrentState();
		}
	}
}
