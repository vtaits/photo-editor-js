import { Tool } from 'photo-editor';

class Crop extends Tool {
  originalImage = null;
  darkenImage = null;
  cropping = false;
  setted = false;
  startX = null;
  startY = null;
  finishX = null;
  finishY = null;

  showCropState() {
    const ctx = this.el.getContext('2d');

    const x = Math.min(this.startX, this.finishX);
    const y = Math.min(this.startY, this.finishY);

    const width = Math.abs(this.startX - this.finishX);
    const height = Math.abs(this.startY - this.finishY);

    ctx.drawImage(this.darkenImage, 0, 0, this.el.width, this.el.height);
    ctx.drawImage(this.originalImage,
      x, y, width, height,
      x, y, width, height,
    );
  }

  applyCrop() {
    const x = Math.min(this.startX, this.finishX);
    const y = Math.min(this.startY, this.finishY);

    const width = Math.abs(this.startX - this.finishX);
    const height = Math.abs(this.startY - this.finishY);

    this.el.width = width;
    this.el.height = height;

    const ctx = this.el.getContext('2d');

    ctx.drawImage(this.originalImage,
      x, y, width, height,
      0, 0, width, height,
    );

    this.pushState(this.el.toDataURL());

    this.originalImage = null;
    this.darkenImage = null;

    this.disable();
  }

  cancelCrop() {
    this.startX = null;
    this.startY = null;
    this.finishX = null;
    this.finishY = null;

    this.setted = false;

    const ctx = this.el.getContext('2d');
    ctx.drawImage(this.darkenImage, 0, 0, this.el.width, this.el.height);

    this.emit('unset');
  }

  onStartDraw = (event) => {
    this.cropping = true;

    this.startX = event.pageX - this.el.offsetLeft;
    this.startY = event.pageY - this.el.offsetTop;
  }

  onProcessDraw = (event) => {
    if (!this.cropping) {
      return;
    }

    this.finishX = event.pageX - this.el.offsetLeft;
    this.finishY = event.pageY - this.el.offsetTop;

    this.showCropState();
  }

  onStopDraw = (event) => {
    if (!this.cropping) {
      return;
    }

    this.cropping = false;
    this.setted = false;

    this.emit('set');
  }

  onAfterEnable() {
    const {
      width,
      height,
    } = this.el;

    this.originalImage = document.createElement('canvas');
    this.originalImage.width = width;
    this.originalImage.height = height;
    this.originalImage.getContext('2d').drawImage(this.el, 0, 0);

    this.darkenImage = document.createElement('canvas');
    this.darkenImage.width = width;
    this.darkenImage.height = height;
    this.darkenImage.getContext('2d').drawImage(this.el, 0, 0);

    const darkenCtx = this.darkenImage.getContext('2d');

    darkenCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    darkenCtx.fillRect(0, 0, width, height);

    this.el.addEventListener('mousedown', this.onStartDraw);
    this.el.addEventListener('mousemove', this.onProcessDraw);
    this.el.addEventListener('mouseup', this.onStopDraw);
  }

  onBeforeDisable() {
    this.cropping = false;
    this.setted = false;

    if (this.darkenImage) {
      this.el.getContext('2d').drawImage(this.originalImage, 0, 0);

      this.originalImage = null;
      this.darkenImage = null;
    }

    this.el.removeEventListener('mousedown', this.onStartDraw);
    this.el.removeEventListener('mousemove', this.onProcessDraw);
    this.el.removeEventListener('mouseup', this.onStopDraw);
  }
}

export default Crop;
