import { Tool } from 'photo-editor';

class Rectangle extends Tool {
  originalImage = null;
  drawing = false;
  startX = null;
  startY = null;
  finishX = null;
  finishY = null;

  showRectangle() {
    const ctx = this.el.getContext('2d');

    const x = Math.min(this.startX, this.finishX);
    const y = Math.min(this.startY, this.finishY);

    const width = Math.abs(this.startX - this.finishX);
    const height = Math.abs(this.startY - this.finishY);

    ctx.drawImage(this.originalImage, 0, 0, this.el.width, this.el.height);

    ctx.beginPath();
    ctx.lineWidth = '4';
    ctx.strokeStyle = '#CB0000';
    ctx.rect(x, y, width, height);
    ctx.stroke();
  }

  onStartDraw = (event) => {
    const x = event.pageX - this.el.offsetLeft;
    const y = event.pageY - this.el.offsetTop;

    this.drawing = true;

    this.startX = x;
    this.startY = y;
  }

  onProcessDraw = (event) => {
    const x = event.pageX - this.el.offsetLeft;
    const y = event.pageY - this.el.offsetTop;

    if (this.drawing) {
      this.finishX = x;
      this.finishY = y;

      this.showRectangle();
    }
  }

  onStopDraw = (event) => {
    if (this.drawing) {
      this.drawing = false;

      this.originalImage.getContext('2d').drawImage(this.el, 0, 0);

      this.pushState(this.el.toDataURL());
    }
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

    this.el.addEventListener('mousedown', this.onStartDraw);
    this.el.addEventListener('mousemove', this.onProcessDraw);
    this.el.addEventListener('mouseup', this.onStopDraw);
  }

  onBeforeDisable() {
    this.drawing = false;

    this.originalImage = null;

    this.el.removeEventListener('mousedown', this.onStartDraw);
    this.el.removeEventListener('mousemove', this.onProcessDraw);
    this.el.removeEventListener('mouseup', this.onStopDraw);
  }
}

export default Rectangle;
