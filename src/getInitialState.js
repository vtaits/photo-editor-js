// TO DO: tests

import waitForImageComplete from './waitForImageComplete';

const emptyImageWarning = 'PhotoEditor: source image is loaded with error';

export async function imageToBase64(image) {
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
}

export default async function getInitialState(el, options) {
  switch (options.sourceType) {
    case 'current-canvas':
      return el.toDataURL();

    case 'canvas':
      return options.source.toDataURL();

    case 'img':
    {
      const base64image = await imageToBase64(options.source);
      return base64image;
    }

    case 'base64':
      return options.source;

    default:
      throw new Error('"sourceType" should be one of: "current-canvas", "canvas", "img", "base64"');
  }
}
