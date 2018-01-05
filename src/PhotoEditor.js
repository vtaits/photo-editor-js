import getInitialState from './getInitialState';
import validateOptions from './validateOptions';
import Tool from './Tool';

const defaultOptions = {
  sourceType: 'current-canvas',
};

class PhotoEditor {
  _el = null;
  _options = null;
  _currentState = -1;
  _states = [];

  _enabledToolId = null;

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

  getCurrentState() {
    return this._states[this._currentState];
  }

  enableTool(toolId) {
    if (!this.tools[toolId]) {
      throw new Error(`PhotoEditor tool with id "${toolId}" is not defined`);
    }

    if (this._enabledToolId) {
      this.tools[this._enabledToolId].disable();
    }

    this._enabledToolId = toolId;

    this.tools[toolId].enable();
  }

  disableTool = () => {
    if (this._enabledToolId) {
      this.tools[this._enabledToolId].disable();
    }

    this._enabledToolId = null;
  }
}

export default PhotoEditor;
