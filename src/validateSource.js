export default function validateSource(options) {
  switch (options.sourceType) {
    case 'current-canvas':
      return

    case 'canvas':
      if (
        !(options.source instanceof HTMLElement) ||
        options.source.tagName !== 'CANVAS'
      ) {
        throw new Error('PhotoEditor source for sourceType "canvas" should be a canvas')
      }

      return

    case 'img':
      if (
        !(options.source instanceof HTMLElement) ||
        options.source.tagName !== 'IMG'
      ) {
        throw new Error('PhotoEditor source for sourceType "img" should be an image')
      }

      return

    case 'base64':
      if (typeof options.source !== 'string') {
        throw new Error('PhotoEditor source for sourceType "base64" should be a string')
      }

      return

    default:
      throw new Error('"sourceType" should be one of: "current-canvas", "canvas", "img", "base64"')
  }
}
