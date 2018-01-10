import { EventEmitter } from 'fbemitter';

import getInitialState from './getInitialState';
import validateOptions from './validateOptions';
import Tool from './Tool';
import waitForImageComplete from './waitForImageComplete';

const defaultOptions = {
  sourceType: 'current-canvas',
};

class PhotoEditor extends EventEmitter {
  _el = null;
  _options = null;
  _currentState = -1;
  _states = [];

  _enabledToolId = null;
  _touched = false;

  _destroyed = false;

  tools = {};

  constructor(el, editorOptions) {
    super();

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

    if (this._options.sourceType !== 'current-canvas') {
      await this._drawCurrentState();
    }

    this._initTools();

    this.emit('ready');
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
          disable: this.disableTool,
          touch: this.touch,
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

    if (this._destroyed) {
      return;
    }

    this._el.width = image.naturalWidth;
    this._el.height = image.naturalHeight;

    const ctx = this._el.getContext('2d');
    ctx.drawImage(image, 0, 0);
  }

  destroy() {
    this._destroyed = true;

    Object.keys(this.tools)
      .forEach((toolId) => {
        const tool = this.tools[toolId];

        tool.destroy();
      });
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

    this.tools[toolId].enableFromEditor();

    this.emit('enableTool', toolId);
  }

  disableTool = () => {
    if (this._enabledToolId) {
      this.tools[this._enabledToolId].disableFromEditor();

      this.emit('disableTool', this._enabledToolId);

      if (this._touched) {
        this._drawCurrentState();
      }

      this._touched = false;

      this._enabledToolId = null;
    }
  }

  toggleTool(toolId) {
    if (this._enabledToolId === toolId) {
      this.disableTool();
    } else {
      this.enableTool(toolId);
    }
  }

  touch = () => {
    this._touched = true;
  }

  undo() {
    if (this._currentState > 0) {
      --this._currentState;

      this.disableTool();

      this._drawCurrentState();
    }
  }

  redo() {
    if (this._currentState < this._states.length - 1) {
      ++this._currentState;

      this.disableTool();

      this._drawCurrentState();
    }
  }
}

export default PhotoEditor;
