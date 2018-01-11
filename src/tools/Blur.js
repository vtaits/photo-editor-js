import Tool from '../Tool';

const radius = 10;

function generateBlurMask(blurMaskRadius) {
  const diam = blurMaskRadius * 2;
  const blurMaskRadius2 = blurMaskRadius * blurMaskRadius;

  const result = [];

  for (let i = 0; i < diam; ++i) {
    for (let j = 0; j < diam; ++j) {
      const dx = blurMaskRadius - i;
      const dy = blurMaskRadius - j;

      result.push((dx * dx) + (dy * dy) <= blurMaskRadius2);
    }
  }

  return result;
}

const blurMask = generateBlurMask(radius);

const defaultSigma = 3;

class Pixel {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  add(pixel) {
    return new Pixel(this.r + pixel.r, this.g + pixel.g, this.b + pixel.b);
  }

  sub(pixel) {
    return new Pixel(this.r - pixel.r, this.g - pixel.g, this.b - pixel.b);
  }

  mul(number) {
    return new Pixel(this.r * number, this.g * number, this.b * number);
  }

  div(number) {
    return new Pixel(this.r / number, this.g / number, this.b / number);
  }

  clone() {
    return new Pixel(this.r, this.g, this.b);
  }
}

// standard deviation, number of boxes
function boxesForGauss(sigma, n) {
  // Ideal averaging filter width
  const wIdeal = Math.sqrt(((12 * sigma * sigma) / n) + 1);

  let wl = Math.floor(wIdeal);
  if (wl % 2 === 0) {
    --wl;
  }

  const wu = wl + 2;

  const mIdeal = (
    (12 * sigma * sigma) -
    (n * wl * wl) -
    (4 * n * wl) -
    (3 * n)
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
function boxBlurH4(scl, tcl, w, h, r) {
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
function boxBlurT4(scl, tcl, w, h, r) {
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
function boxBlur4(scl, tcl, w, h, r) {
  for (let i = 0; i < scl.length; ++i) {
    tcl[i] = scl[i].clone();
  }

  boxBlurH4(tcl, scl, w, h, r);
  boxBlurT4(scl, tcl, w, h, r);
}
/* eslint-enable no-param-reassign */

function gaussBlur4(scl, tcl, w, h, r) {
  const bxs = boxesForGauss(r, 3);

  boxBlur4(scl, tcl, w, h, (bxs[0] - 1) / 2);
  boxBlur4(tcl, scl, w, h, (bxs[1] - 1) / 2);
  boxBlur4(scl, tcl, w, h, (bxs[2] - 1) / 2);
}

class Blur extends Tool {
  bluring = false;
  lastX = null;
  lastY = null;

  onStartDraw = (event) => {
    this.bluring = true;

    this.lastX = event.offsetX;
    this.lastY = event.offsetY;
  }

  onProcessDraw = (event) => {
    if (!this.bluring) {
      return;
    }

    const newLastX = event.offsetX;
    const newLastY = event.offsetY;

    this.blurAtPoint(newLastX, newLastY);

    this.lastX = newLastX;
    this.lastY = newLastY;
  }

  onStopDraw = () => {
    if (!this.bluring) {
      return;
    }

    this.bluring = false;

    this.lastX = null;
    this.lastY = null;

    this.pushState(this.el.toDataURL());
  }

  blurAtPoint(_x, _y) {
    const ctx = this.el.getContext('2d');

    const x = Math.round(_x);
    const y = Math.round(_y);

    const {
      width,
      height,
    } = this.el;

    const startX = Math.max(x - radius, 0);
    const finishX = Math.min(x + radius, width);

    const startY = Math.max(y - radius, 0);
    const finishY = Math.min(y + radius, height);

    const newImgWidth = finishX - startX;
    const newImgHeight = finishY - startY;

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

    const targetChannel = sourceChannel;

    gaussBlur4(sourceChannel, targetChannel, newImgWidth, newImgHeight, defaultSigma);

    for (let i = 0, l = newImgWidth * newImgHeight; i < l; ++i) {
      if (blurMask[i]) {
        const { r, g, b } = targetChannel[i];
        const offset = i * 4;

        newImgData.data[offset] = r;
        newImgData.data[offset + 1] = g;
        newImgData.data[offset + 2] = b;
        newImgData.data[offset + 3] = 255;
      }
    }

    ctx.putImageData(newImgData, startX, startY);
  }

  onAfterEnable() {
    this.el.addEventListener('mousedown', this.onStartDraw);
    this.el.addEventListener('mousemove', this.onProcessDraw);
    this.el.addEventListener('mouseup', this.onStopDraw);
  }

  onBeforeDisable() {
    this.bluring = false;

    this.el.removeEventListener('mousedown', this.onStartDraw);
    this.el.removeEventListener('mousemove', this.onProcessDraw);
    this.el.removeEventListener('mouseup', this.onStopDraw);
  }
}

export default Blur;
