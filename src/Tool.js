import { EventEmitter } from 'fbemitter';

class Tool extends EventEmitter {
  el = null;

  enabled = false;

  pushState = null;

  updateState = null;

  touch = null;

  disable = null;

  constructor(options) {
    super();

    if (typeof options !== 'object') {
      throw new Error('Tool options should be an object');
    }

    if (options === null) {
      throw new Error('Tool options can\'t be null');
    }

    if (
      !(options.el instanceof HTMLElement)
      || options.el.tagName !== 'CANVAS'
    ) {
      throw new Error('Element for init Tool should be a canvas');
    }

    this.el = options.el;

    if (typeof options.pushState !== 'function') {
      throw new Error('Tool option "pushState" should be a function');
    }

    this.pushState = options.pushState;

    if (typeof options.updateState !== 'function') {
      throw new Error('Tool option "updateState" should be a function');
    }

    this.updateState = options.updateState;

    if (typeof options.disable !== 'function') {
      throw new Error('Tool option "disable" should be a function');
    }

    this.disable = options.disable;

    if (typeof options.touch !== 'function') {
      throw new Error('Tool option "touch" should be a function');
    }

    this.touch = options.touch;
  }

  disableFromEditor() {
    if (this.onBeforeDisable) {
      this.onBeforeDisable();
    }

    this.enabled = false;

    if (this.onAfterDisable) {
      this.onAfterDisable();
    }
  }

  enableFromEditor() {
    if (this.onBeforeEnable) {
      this.onBeforeEnable();
    }

    this.enabled = true;

    if (this.onAfterEnable) {
      this.onAfterEnable();
    }
  }

  destroy() {
    if (this.onBeforeDestroy) {
      this.onBeforeDestroy();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  reset() {

  }
}

export default Tool;
