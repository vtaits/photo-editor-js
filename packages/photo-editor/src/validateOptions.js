import { validateSource } from "./validateSource.js";
/**
 * @import { Tool } from "./Tool/index.js"
 * @import { PhotoEditorOptions, SourceType } from "./types.js"
 */

/**
 * @template {Record<string, typeof Tool>} Tools
 * @template {SourceType} CurrentSource
 * @param {PhotoEditorOptions<Tools, CurrentSource>} options
 */
export const validateOptions = (options) => {
	if (typeof options !== "object") {
		throw new Error("PhotoEditor options should be an object");
	}

	if (options === null) {
		throw new Error("PhotoEditor options can't be null");
	}

	if (typeof options.tools !== "object") {
		throw new Error("PhotoEditor tools should be an object");
	}

	if (options.tools === null) {
		throw new Error("PhotoEditor tools can't be null");
	}

	validateSource(options);
};
