import type { Tool } from "./Tool";
import type { PhotoEditorOptions, SourceType } from "./types";
import { validateSource } from "./validateSource";

export const validateOptions = <
	Tools extends Record<string, typeof Tool>,
	CurrentSource extends SourceType,
>(
	options: PhotoEditorOptions<Tools, CurrentSource>,
): void => {
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
