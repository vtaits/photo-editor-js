import { Tool } from 'photo-editor';

class RotateRight extends Tool {
  onAfterEnable() {
    const ctx = this.el.getContext('2d');

    const {
      width,
      height,
    } = this.el;

    const otherCanvas = document.createElement('canvas');
    otherCanvas.width = width;
    otherCanvas.height = height;
    otherCanvas.getContext('2d').drawImage(this.el, 0, 0);

    canvas.width = height;
    canvas.height = width;

    ctx.clearRect(0, 0, width, height);
    ctx.translate(height / 2, width / 2);
    ctx.rotate(Math.PI / 2);
    ctx.translate(-width / 2, -height / 2);
    ctx.drawImage(otherCanvas, 0, 0);

    this.pushState(this.el.toDataURL());

    this.disable();
  }
}

export default RotateRight;
