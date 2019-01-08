import Tool from '../Tool';

class Filter extends Tool {
  value = 0;

  applied = false;

  setValue(value) {
    const newValue = Math.min(Math.max(value, -1), 1);
    if (newValue === this.value) {
      return;
    }

    this.value = newValue;
    this.apply();
  }

  getValue() {
    return this.value;
  }

  newImageData() {
    return this.originalImageData;
  }

  apply = () => {
    const ctx = this.el.getContext('2d');

    ctx.putImageData(this.newImageData(), 0, 0);

    if (this.applied === false) {
      this.pushState(this.el.toDataURL());
      this.applied = true;
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
    this.value = 0;
    this.applied = false;
    this.originalImageData = null;
  }
}

export default Filter;
