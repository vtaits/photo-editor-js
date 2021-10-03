import { Tool } from '../Tool';

export class Rectangle extends Tool {
  originalImage: HTMLCanvasElement = null;

  drawing = false;

  startX: number = null;

  startY: number = null;

  finishX: number = null;

  finishY: number = null;

  showRectangle(): void {
    const ctx = this.el.getContext('2d');

    const x = Math.min(this.startX, this.finishX);
    const y = Math.min(this.startY, this.finishY);

    const width = Math.abs(this.startX - this.finishX);
    const height = Math.abs(this.startY - this.finishY);

    ctx.clearRect(0, 0, this.el.width, this.el.height);
    ctx.drawImage(this.originalImage, 0, 0, this.el.width, this.el.height);

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#CB0000';
    ctx.rect(x, y, width, height);
    ctx.stroke();
  }

  onStartDraw = (event: MouseEvent): void => {
    const x = (event.offsetX) / (this.el.clientWidth / this.el.width);
    const y = (event.offsetY) / (this.el.clientHeight / this.el.height);

    this.drawing = true;

    this.startX = x;
    this.startY = y;
  };

  onProcessDraw = (event: MouseEvent): void => {
    const x = (event.offsetX) / (this.el.clientWidth / this.el.width);
    const y = (event.offsetY) / (this.el.clientHeight / this.el.height);

    if (this.drawing) {
      this.finishX = x;
      this.finishY = y;

      this.showRectangle();
    }
  };

  onStopDraw = (): void => {
    if (!this.drawing) {
      return;
    }

    this.drawing = false;
    this.originalImage.getContext('2d').drawImage(this.el, 0, 0);
    this.pushState(this.el.toDataURL());
  };

  onAfterEnable(): void {
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

  onBeforeDisable(): void {
    this.drawing = false;

    this.originalImage = null;

    this.el.removeEventListener('mousedown', this.onStartDraw);
    this.el.removeEventListener('mousemove', this.onProcessDraw);
    this.el.removeEventListener('mouseup', this.onStopDraw);
  }
}
