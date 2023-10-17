import type { Tool } from "./Tool";
import type { PhotoEditorOptions, SourceType } from "./types";

export const validateSource = <
	Tools extends Record<string, typeof Tool>,
	CurrentSource extends SourceType,
>(
	options: PhotoEditorOptions<Tools, CurrentSource>,
): void => {
	switch (options.sourceType) {
		case "current-canvas":
			return;

		case "canvas": {
			const { source } = options as unknown as PhotoEditorOptions<
				Tools,
				"canvas"
			>;

			if (!(source instanceof HTMLElement) || source.tagName !== "CANVAS") {
				throw new Error(
					'PhotoEditor source for sourceType "canvas" should be a canvas',
				);
			}

			return;
		}

		case "img": {
			const { source } = options as unknown as PhotoEditorOptions<Tools, "img">;

			if (!(source instanceof HTMLElement) || source.tagName !== "IMG") {
				throw new Error(
					'PhotoEditor source for sourceType "img" should be an image',
				);
			}

			return;
		}

		case "base64": {
			const { source } = options as unknown as PhotoEditorOptions<
				Tools,
				"base64"
			>;

			if (typeof source !== "string") {
				throw new Error(
					'PhotoEditor source for sourceType "base64" should be a string',
				);
			}

			return;
		}

		default:
			throw new Error(
				'"sourceType" should be one of: "current-canvas", "canvas", "img", "base64"',
			);
	}
};
