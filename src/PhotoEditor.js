import validateOptions from './validateOptions';

const defaultOptions = {
  sourceType: 'current-canvas',
};

class PhotoEditor {
  constructor(el, editorOptions) {
    const options = {
      ...defaultOptions,
      ...editorOptions,
    };

    if (!(el instanceof HTMLElement) || el.tagName !== 'CANVAS') {
      throw new Error('Element for init PhotoEditor should be a canvas');
    }

    validateOptions(options);

    this._el = el;
    this._options = options;
  }
}

export default PhotoEditor;
