/* eslint-disable max-classes-per-file */
import { Tool } from '../Tool';

class Pixel {
  r: number;

  g: number;

  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  add(pixel: Pixel) {
    return new Pixel(this.r + pixel.r, this.g + pixel.g, this.b + pixel.b);
  }

  sub(pixel: Pixel) {
    return new Pixel(this.r - pixel.r, this.g - pixel.g, this.b - pixel.b);
  }

  mul(value: number) {
    return new Pixel(this.r * value, this.g * value, this.b * value);
  }

  div(value: number) {
    return new Pixel(this.r / value, this.g / value, this.b / value);
  }

  clone() {
    return new Pixel(this.r, this.g, this.b);
  }
}

// standard deviation, number of boxes
function boxesForGauss(sigma: number, n: number) {
  // Ideal averaging filter width
  const wIdeal = Math.sqrt(((12 * sigma * sigma) / n) + 1);

  let wl = Math.floor(wIdeal);
  if (wl % 2 === 0) {
    --wl;
  }

  const wu = wl + 2;

  const mIdeal = (
    (12 * sigma * sigma)
    - (n * wl * wl)
    - (4 * n * wl)
    - (3 * n)
  ) / (
    (-4 * wl) - 4
  );
  const m = Math.round(mIdeal);

  const sizes = [];

  for (let i = 0; i < n; ++i) {
    sizes.push(i < m ? wl : wu);
  }

  return sizes;
}

/* eslint-disable no-param-reassign */
function boxBlurH(
  scl: Pixel[],
  tcl: Pixel[],
  w: number,
  h: number,
  r: number,
): void {
  const iarr = 1 / (r + r + 1);

  for (let i = 0; i < h; ++i) {
    let ti = i * w;
    let li = ti;
    let ri = ti + r;

    const fv = scl[ti];
    const lv = scl[ti + (w - 1)];

    let val = fv.mul(r + 1);

    for (let j = 0; j < r; ++j) {
      val = val.add(scl[ti + j]);
    }

    for (let j = 0; j <= r; ++j) {
      val = val.add(scl[ri].sub(fv));
      ++ri;

      tcl[ti] = val.mul(iarr);
      ++ti;
    }

    for (let j = r + 1; j < w - r; ++j) {
      val = val.add(scl[ri++].sub(scl[li]));
      ++li;

      tcl[ti] = val.mul(iarr);
      ++ti;
    }

    for (let j = w - r; j < w; ++j) {
      val = val.add(lv.sub(scl[li]));
      ++li;

      tcl[ti] = val.mul(iarr);
      ++ti;
    }
  }
}
/* eslint-enable no-param-reassign */

/* eslint-disable no-param-reassign */
function boxBlurT(
  scl: Pixel[],
  tcl: Pixel[],
  w: number,
  h: number,
  r: number,
): void {
  const iarr = 1 / (r + r + 1);

  for (let i = 0; i < w; ++i) {
    let ti = i;
    let li = ti;
    let ri = ti + (r * w);

    const fv = scl[ti];
    const lv = scl[ti + (w * (h - 1))];

    let val = fv.mul(r + 1);

    for (let j = 0; j < r; ++j) {
      val = val.add(scl[ti + (j * w)]);
    }

    for (let j = 0; j <= r; j++) {
      val = val.add(scl[ri].sub(fv));
      tcl[ti] = val.mul(iarr);
      ri += w;
      ti += w;
    }

    for (let j = r + 1; j < h - r; j++) {
      val = val.add(scl[ri].sub(scl[li]));
      tcl[ti] = val.mul(iarr);

      li += w;
      ri += w;
      ti += w;
    }

    for (let j = h - r; j < h; j++) {
      val = val.add(lv.sub(scl[li]));
      tcl[ti] = val.mul(iarr);

      li += w;
      ti += w;
    }
  }
}
/* eslint-enable no-param-reassign */

/* eslint-disable no-param-reassign */
function boxBlur(
  scl: Pixel[],
  tcl: Pixel[],
  w: number,
  h: number,
  r: number,
): void {
  for (let i = 0; i < scl.length; ++i) {
    tcl[i] = scl[i].clone();
  }

  boxBlurH(tcl, scl, w, h, r);
  boxBlurT(scl, tcl, w, h, r);
}
/* eslint-enable no-param-reassign */

function gaussBlur(
  scl: Pixel[],
  tcl: Pixel[],
  w: number,
  h: number,
  r: number,
): void {
  const bxs = boxesForGauss(r, 3);

  boxBlur(scl, tcl, w, h, (bxs[0] - 1) / 2);
  boxBlur(tcl, scl, w, h, (bxs[1] - 1) / 2);
  boxBlur(scl, tcl, w, h, (bxs[2] - 1) / 2);
}

export class Blur extends Tool {
  bluring = false;

  lastX = null;

  lastY = null;

  sigma = 3;

  radius = 10;

  setRadius(value: number): void {
    this.radius = Math.max(value, 1);
  }

  getRadius(): number {
    return this.radius;
  }

  setSigma(value: number): void {
    this.sigma = Math.max(value, 0.1);
  }

  getSigma(): number {
    return this.sigma;
  }

  onStartDraw = (event: MouseEvent): void => {
    this.bluring = true;

    const newLastX = (event.offsetX) / (this.el.clientWidth / this.el.width);
    const newLastY = (event.offsetY) / (this.el.clientHeight / this.el.height);

    this.blurAtPoint(newLastX, newLastY);

    this.lastX = newLastX;
    this.lastY = newLastY;
  };

  onProcessDraw = (event: MouseEvent): void => {
    if (!this.bluring) {
      return;
    }

    const newLastX = (event.offsetX) / (this.el.clientWidth / this.el.width);
    const newLastY = (event.offsetY) / (this.el.clientHeight / this.el.height);

    this.blurAtPoint(newLastX, newLastY);

    this.lastX = newLastX;
    this.lastY = newLastY;
  };

  onStopDraw = (): void => {
    if (!this.bluring) {
      return;
    }

    this.bluring = false;

    this.lastX = null;
    this.lastY = null;

    this.pushState(this.el.toDataURL());
  };

  blurAtPoint(_x: number, _y: number): void {
    const ctx = this.el.getContext('2d');
    const radius = this.getRadius();
    const sigma = this.getSigma();
    const x = Math.round(_x);
    const y = Math.round(_y);

    const {
      width,
      height,
    } = this.el;

    const startX = Math.max(x - radius, 0);
    const finishX = Math.max(Math.min(x + radius, width), 0);

    const startY = Math.max(y - radius, 0);
    const finishY = Math.max(Math.min(y + radius, height), 0);

    const newImgWidth = finishX - startX;
    const newImgHeight = finishY - startY;

    if (newImgWidth <= 0 || newImgHeight <= 0) {
      return;
    }

    const newImgData = ctx.getImageData(startX, startY, newImgWidth, newImgHeight);

    const sourceChannel = [];
    {
      const {
        data,
      } = newImgData;

      for (let i = 0, l = newImgWidth * newImgHeight; i < l; ++i) {
        const offset = i * 4;

        sourceChannel.push(new Pixel(data[offset], data[offset + 1], data[offset + 2]));
      }
    }

    const targetChannel = [];
    gaussBlur(sourceChannel, targetChannel, newImgWidth, newImgHeight, sigma);

    for (let i = 0, l = newImgWidth * newImgHeight; i < l; ++i) {
      const { r, g, b } = targetChannel[i];
      const offset = i * 4;

      newImgData.data[offset] = r;
      newImgData.data[offset + 1] = g;
      newImgData.data[offset + 2] = b;
      newImgData.data[offset + 3] = 255;
    }

    const bluredPiece = document.createElement('canvas');
    bluredPiece.height = newImgData.height;
    bluredPiece.width = newImgData.width;
    bluredPiece.getContext('2d').putImageData(newImgData, 0, 0);

    const pattern = ctx.createPattern(bluredPiece, 'no-repeat');

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = pattern;
    ctx.translate(startX, startY);
    ctx.arc(x - startX, y - startY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  onAfterEnable(): void {
    this.el.addEventListener('mousedown', this.onStartDraw);
    this.el.addEventListener('mousemove', this.onProcessDraw);
    this.el.addEventListener('mouseup', this.onStopDraw);
  }

  onBeforeDisable(): void {
    this.bluring = false;

    this.el.removeEventListener('mousedown', this.onStartDraw);
    this.el.removeEventListener('mousemove', this.onProcessDraw);
    this.el.removeEventListener('mouseup', this.onStopDraw);
  }
}
