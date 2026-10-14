// TO DO: tests
import { unwrap } from "krustykrab";
import { waitForImageComplete } from "./waitForImageComplete.js";

/**
 * @import { Tool } from "./Tool/index.js"
 * @import { PhotoEditorOptions, SourceType } from "./types.js"
 */

const emptyImageWarning = "PhotoEditor: source image is loaded with error";

/**
 *
 * @param {HTMLImageElement} image
 * @returns {Promise<string>}
 */
export const imageToBase64 = async (image) => {
	if (image.complete) {
		if (image.naturalWidth === 0) {
			console.warn(emptyImageWarning);
		}
	} else {
		try {
			await waitForImageComplete(image);
		} catch (_e) {
			console.warn(emptyImageWarning);
		}
	}

	const fakeCanvasEl = document.createElement("canvas");
	const ctx = unwrap(fakeCanvasEl.getContext("2d"));

	fakeCanvasEl.height = image.naturalHeight;
	fakeCanvasEl.width = image.naturalWidth;

	ctx.drawImage(image, 0, 0);

	return fakeCanvasEl.toDataURL();
};
/**
 * @template {Record<string, typeof Tool>} Tools
 * @template {SourceType} CurrentSource
 * @param {HTMLCanvasElement} el
 * @param {PhotoEditorOptions<Tools, CurrentSource>} options
 * @returns {Promise<string>}
 */
export const getInitialState = async (el, options) => {
	switch (options.sourceType) {
		case "current-canvas":
			return el.toDataURL();

		case "canvas":
			return /** @type {PhotoEditorOptions<Tools, "canvas">} */ (
				options
			).source.toDataURL();

		case "img": {
			const base64image = await imageToBase64(
				/** @type {PhotoEditorOptions<Tools, "img">} */ (options).source,
			);
			return base64image;
		}

		case "base64":
			return /** @type {PhotoEditorOptions<Tools, "base64">} */ (options)
				.source;

		default:
			throw new Error(
				'"sourceType" should be one of: "current-canvas", "canvas", "img", "base64"',
			);
	}
};
