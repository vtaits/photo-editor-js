import type {
  PhotoEditorOptions,
  SourceType,
} from './types';

export const validateSource = <CurrentSource extends SourceType>(
  options: PhotoEditorOptions<any, CurrentSource>,
) => {
  switch (options.sourceType) {
    case 'current-canvas':
      return;

    case 'canvas':
    {
      const {
        source,
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
      } = options as unknown as PhotoEditorOptions<any, 'base64'>;

      if (typeof source !== 'string') {
        throw new Error('PhotoEditor source for sourceType "base64" should be a string');
      }

      return;
    }

    default:
      throw new Error('"sourceType" should be one of: "current-canvas", "canvas", "img", "base64"');
  }
}
