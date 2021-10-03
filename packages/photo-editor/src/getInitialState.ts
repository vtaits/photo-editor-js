// TO DO: tests

import { waitForImageComplete } from './waitForImageComplete';

import type {
  Tool,
} from './Tool';
import type {
  PhotoEditorOptions,
  SourceType,
} from './types';

const emptyImageWarning = 'PhotoEditor: source image is loaded with error';

export const imageToBase64 = async (image: HTMLImageElement): Promise<string> => {
  if (image.complete) {
    if (image.naturalWidth === 0) {
      // eslint-disable-next-line no-console
      console.warn(emptyImageWarning);
    }
  } else {
    try {
      await waitForImageComplete(image);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(emptyImageWarning);
    }
  }

  const fakeCanvasEl = document.createElement('canvas');
  const ctx = fakeCanvasEl.getContext('2d');

  fakeCanvasEl.height = image.naturalHeight;
  fakeCanvasEl.width = image.naturalWidth;
  ctx.drawImage(image, 0, 0);

  return fakeCanvasEl.toDataURL();
};

export const getInitialState = async <
Tools extends Record<string, typeof Tool>,
CurrentSource extends SourceType,
>(
  el: HTMLCanvasElement,
  options: PhotoEditorOptions<Tools, CurrentSource>,
): Promise<string> => {
  switch (options.sourceType) {
    case 'current-canvas':
      return el.toDataURL();

    case 'canvas':
      return (options as unknown as PhotoEditorOptions<Tools, 'canvas'>).source.toDataURL();

    case 'img':
    {
      const base64image = await imageToBase64(
        (options as unknown as PhotoEditorOptions<Tools, 'img'>).source,
      );
      return base64image;
    }

    case 'base64':
      return (options as unknown as PhotoEditorOptions<Tools, 'base64'>).source;

    default:
      throw new Error('"sourceType" should be one of: "current-canvas", "canvas", "img", "base64"');
  }
};
