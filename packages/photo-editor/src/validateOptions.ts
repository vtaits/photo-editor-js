import { validateSource } from "./validateSource";

import type { PhotoEditorOptions, SourceType } from "./types";

export const validateOptions = <CurrentSource extends SourceType>(
	options: PhotoEditorOptions<any, CurrentSource>,
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
