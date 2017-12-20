class Tool {
  enabled = false;
  pushState = null;

  constructor(options) {
    if (typeof options !== 'object') {
      throw new Error('Tool options should be an object');
    }

    if (options === null) {
      throw new Error('Tool options can\'t be null');
    }

    if (typeof options.pushState !== 'function') {
      throw new Error('Tool option "pushState" should be a function');
    }
  }

  disable() {
    if (this.onBeforeDisable) {
      this.onBeforeDisable();
    }

    this.enabled = false;

    if (this.onAfterDisable) {
      this.onAfterDisable();
    }
  }

  enable() {
    if (this.onBeforeEnable) {
      this.onBeforeEnable();
    }

    this.enabled = true;

    if (this.onAfterEnable) {
      this.onAfterEnable();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  reset() {

  }
}

export default Tool;
