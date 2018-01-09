import { Tool } from 'photo-editor';

class Pencil extends Tool {
  drawing = false;
  lastX = null;
  lastY = null;

  onStartDraw = (event) => {
    this.drawing = true;

    this.lastX = event.pageX - this.el.offsetLeft;
    this.lastY = event.pageY - this.el.offsetTop;
  }

  onProcessDraw = (event) => {
    if (!this.drawing) {
      return;
    }

    const newLastX = event.pageX - this.el.offsetLeft;
    const newLastY = event.pageY - this.el.offsetTop;

    const ctx = this.el.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(newLastX, newLastY);
    ctx.stroke();

    this.lastX = newLastX;
    this.lastY = newLastY;
  }

  onStopDraw = (event) => {
    if (!this.drawing) {
      return;
    }

    this.drawing = false;

    this.lastX = null;
    this.lastY = null;
  }

  onAfterEnable() {
    this.el.addEventListener('mousedown', this.onStartDraw);
    this.el.addEventListener('mousemove', this.onProcessDraw);
    this.el.addEventListener('mouseup', this.onStopDraw);
  }

  onBeforeDisable() {
    this.drawing = false;

    this.el.removeEventListener('mousedown', this.onStartDraw);
    this.el.removeEventListener('mousemove', this.onProcessDraw);
    this.el.removeEventListener('mouseup', this.onStopDraw);
  }
}

export default Pencil;
