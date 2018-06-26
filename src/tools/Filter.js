import Tool from '../Tool';

class Filter extends Tool {
  _value = 0;
  applyed = false;

  set value(value) {
    const newValue = Math.min(Math.max(parseFloat(value), -1), 1);
    if (newValue === this._value) {
      return;
    }

    this._value = newValue;
    this.apply();
  }

  get value() {
    return this._value;
  }

  newImageData() {
    return this.originalImageData;
  }

  apply = () => {
    const ctx = this.el.getContext('2d');

    ctx.putImageData(this.newImageData(), 0, 0);

    if (this.applyed === false) {
      this.pushState(this.el.toDataURL());
      this.applyed = true;
    } else {
      this.updateState(this.el.toDataURL());
    }
  }

  onAfterEnable() {
    const ctx = this.el.getContext('2d');
    const {
      width,
      height,
    } = this.el;

    this.originalImageData = ctx.getImageData(0, 0, width, height);
  }

  onBeforeDisable() {
    this._value = 0;
    this.applyed = false;
    this.originalImageData = null;
  }
}

export default Filter;
