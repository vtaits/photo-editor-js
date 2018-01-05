import getInitialState from './getInitialState';
import validateOptions from './validateOptions';
import Tool from './Tool';
import waitForImageComplete from './waitForImageComplete';

const defaultOptions = {
  sourceType: 'current-canvas',
};

class PhotoEditor {
  _el = null;
  _options = null;
  _currentState = -1;
  _states = [];

  _enabledToolId = null;
  _touched = false;

  tools = {};

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

    this._init();
  }

  async _init() {
    const initialState = await getInitialState(this._el, this._options);

    this._currentState = 0;
    this._states = [initialState];

    this._initTools();
  }

  _initTools() {
    Object.keys(this._options.tools)
      .forEach((toolId) => {
        const ToolConstructor = this._options.tools[toolId];

        if (typeof ToolConstructor !== 'function') {
          throw new Error(`PhotoEditor tool "${toolId}": should be a class that extends Tool`);
        }

        const tool = new ToolConstructor({
          el: this._el,
          pushState: this._pushState,
        });

        if (!(tool instanceof Tool)) {
          throw new Error(`PhotoEditor tool "${toolId}": should be an instance of Tool `);
        }

        this.tools[toolId] = tool;
      });
  }

  _pushState = (state) => {
    const slicedStates = this._states.slice(0, this._currentState + 1);
    slicedStates.push(state);

    ++this._currentState;
    this._states = slicedStates;
  }

  async _drawCurrentState() {
    // TO DO: test
    const base64 = this.getCurrentState();

    const image = new Image();

    image.src = base64;

    await waitForImageComplete(image);

    this._el.width = image.naturalWidth;
    this._el.height = image.naturalHeight;

    const ctx = this._el.getContext('2d');
    ctx.drawImage(image, 0, 0);
  }

  getCurrentState() {
    return this._states[this._currentState];
  }

  enableTool(toolId) {
    if (!this.tools[toolId]) {
      throw new Error(`PhotoEditor tool with id "${toolId}" is not defined`);
    }

    this.disableTool();

    this._enabledToolId = toolId;

    this.tools[toolId].enable();
  }

  disableTool = () => {
    if (this._enabledToolId) {
      this.tools[this._enabledToolId].disable();

      if (this._touched) {
        this._drawCurrentState();
      }

      this._touched = false;

      this._enabledToolId = null;
    }
  }

  touch = () => {
    this._touched = true;
  }
}

export default PhotoEditor;
