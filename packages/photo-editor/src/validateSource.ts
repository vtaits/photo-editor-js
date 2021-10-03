import type {
  PhotoEditorOptions,
  SourceType,
} from './types';

export const validateSource = <CurrentSource extends SourceType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: PhotoEditorOptions<any, CurrentSource>,
): void => {
  switch (options.sourceType) {
    case 'current-canvas':
      return;

    case 'canvas':
    {
      const {
        source,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } = options as unknown as PhotoEditorOptions<any, 'canvas'>;

      if (
        !(source instanceof HTMLElement)
        || source.tagName !== 'CANVAS'
      ) {
        throw new Error('PhotoEditor source for sourceType "canvas" should be a canvas');
      }

      return;
    }

    case 'img':
    {
      const {
        source,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } = options as unknown as PhotoEditorOptions<any, 'img'>;

      if (
        !(source instanceof HTMLElement)
        || source.tagName !== 'IMG'
      ) {
        throw new Error('PhotoEditor source for sourceType "img" should be an image');
      }

      return;
    }

    case 'base64':
    {
      const {
        source,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } = options as unknown as PhotoEditorOptions<any, 'base64'>;

      if (typeof source !== 'string') {
        throw new Error('PhotoEditor source for sourceType "base64" should be a string');
      }

      return;
    }

    default:
      throw new Error('"sourceType" should be one of: "current-canvas", "canvas", "img", "base64"');
  }
};
