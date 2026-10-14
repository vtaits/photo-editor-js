/**
 * @import { Tool } from "./Tool/index.js"
 * @import { PhotoEditorOptions, SourceType } from "./types.js"
 */

/**
 * @template {Record<string, typeof Tool>} Tools
 * @template {SourceType} CurrentSource
 * @param {PhotoEditorOptions<Tools, CurrentSource>} options
 */
export const validateSource = (options) => {
	switch (options.sourceType) {
		case "current-canvas":
			return;

		case "canvas": {
			const { source } = /** @type {PhotoEditorOptions<
				Tools,
				"canvas"
			>}*/ (options);

			if (!(source instanceof HTMLElement) || source.tagName !== "CANVAS") {
				throw new Error(
					'PhotoEditor source for sourceType "canvas" should be a canvas',
				);
			}

			return;
		}

		case "img": {
			const { source } = /** @type {PhotoEditorOptions<
				Tools,
				"img"
			>}*/ (options);

			if (!(source instanceof HTMLElement) || source.tagName !== "IMG") {
				throw new Error(
					'PhotoEditor source for sourceType "img" should be an image',
				);
			}

			return;
		}

		case "base64": {
			const { source } = /** @type {PhotoEditorOptions<
				Tools,
				"base64"
			>}*/ (options);

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
