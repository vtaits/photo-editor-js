import 'babel-polyfill';

import { PhotoEditor } from 'photo-editor';

import {
  Blur,
  Crop,
  Contrast,
  Brightness,
  Rectangle,
  RotateLeft,
  RotateRight,
} from 'photo-editor/lib/tools';

const canvasEl = document.getElementById('canvas');

const blurButtonEl = document.getElementById('blur');
const blurSettings = document.getElementById('blurSettings');
const blurRadius = document.getElementById('radius');
const blurSigma = document.getElementById('sigma');

const rectangleButtonEl = document.getElementById('rectangle');

const cropButtonEl = document.getElementById('crop');
const cropActions = document.getElementById('cropActions');
const applyCropButtonEl = document.getElementById('apply-crop');
const cancelCropButtonEl = document.getElementById('cancel-crop');

const rotateLeftButtonEl = document.getElementById('rotate-left');
const rotateRightButtonEl = document.getElementById('rotate-right');

const contrastButtonEl = document.getElementById('contrast');
const contrastSettings = document.getElementById('contrastSettings');
const contrastValue = document.getElementById('contrastValue');

const brightnessButtonEl = document.getElementById('brightness');
const brightnessSettings = document.getElementById('brightnessSettings');
const brightnessValue = document.getElementById('brightnessValue');

const undoButtonEl = document.getElementById('undo');
const redoButtonEl = document.getElementById('redo');

const photoEditor = new PhotoEditor(canvasEl, {
  tools: {
    blur: Blur,
    crop: Crop,
    rectangle: Rectangle,
    rotateLeft: RotateLeft,
    rotateRight: RotateRight,
    contrast: Contrast,
    brightness: Brightness,
  },
  sourceType: 'img',
  source: document.getElementById('source'),
});

photoEditor.addListener('enableTool', (tool) => {
  if (tool === 'blur') {
    blurButtonEl.style.border = '2px solid #aa0000';
  }

  if (tool === 'crop') {
    cropButtonEl.style.border = '2px solid #aa0000';
  }

  if (tool === 'contrast') {
    contrastButtonEl.style.border = '2px solid #aa0000';
  }

  if (tool === 'brightness') {
    brightnessButtonEl.style.border = '2px solid #aa0000';
  }

  if (tool === 'rectangle') {
    rectangleButtonEl.style.border = '2px solid #aa0000';
  }
});

photoEditor.addListener('disableTool', () => {
  blurButtonEl.style.removeProperty('border');
  cropButtonEl.style.removeProperty('border');
  contrastButtonEl.style.removeProperty('border');
  brightnessButtonEl.style.removeProperty('border');
  rectangleButtonEl.style.removeProperty('border');
  applyCropButtonEl.disabled = true;
  cancelCropButtonEl.disabled = true;
});

photoEditor.addListener('ready', () => {
  photoEditor.tools.crop.addListener('set', () => {
    applyCropButtonEl.disabled = false;
    cancelCropButtonEl.disabled = false;
  });

  photoEditor.tools.crop.addListener('unset', () => {
    applyCropButtonEl.disabled = true;
    cancelCropButtonEl.disabled = true;
  });


  blurButtonEl.onclick = () => {
    photoEditor.toggleTool('blur');
  };

  cropButtonEl.onclick = () => {
    photoEditor.toggleTool('crop');
  };

  applyCropButtonEl.onclick = () => {
    photoEditor.tools.crop.applyCrop();
  };

  cancelCropButtonEl.onclick = () => {
    photoEditor.tools.crop.cancelCrop();
  };

  rectangleButtonEl.onclick = () => {
    photoEditor.toggleTool('rectangle');
  };

  rotateLeftButtonEl.onclick = () => {
    photoEditor.enableTool('rotateLeft');
  };

  rotateRightButtonEl.onclick = () => {
    photoEditor.enableTool('rotateRight');
  };

  contrastButtonEl.onclick = () => {
    photoEditor.toggleTool('contrast');
  };

  brightnessButtonEl.onclick = () => {
    photoEditor.toggleTool('brightness');
  };

  undoButtonEl.onclick = () => {
    photoEditor.undo();
  };

  redoButtonEl.onclick = () => {
    photoEditor.redo();
  };

  const afterEnableBlur = photoEditor.tools.blur.onAfterEnable;
  photoEditor.tools.blur.onAfterEnable = () => {
    if (afterEnableBlur) {
      afterEnableBlur.call(photoEditor.tools.blur);
    }

    blurSettings.classList.remove('hide');
    blurRadius.value = photoEditor.tools.blur.radius;
    blurSigma.value = photoEditor.tools.blur.sigma;
  };

  photoEditor.tools.blur.onAfterDisable = () => {
    blurSettings.classList.add('hide');
  };

  blurRadius.oninput = (e) => {
    photoEditor.tools.blur.radius = e.target.value;
  };

  blurSigma.oninput = (e) => {
    photoEditor.tools.blur.sigma = e.target.value;
  };

  const afterEnableCrop = photoEditor.tools.crop.onAfterEnable;
  photoEditor.tools.crop.onAfterEnable = () => {
    if (afterEnableCrop) {
      afterEnableCrop.call(photoEditor.tools.crop);
    }

    cropActions.classList.remove('hide');
    blurRadius.value = photoEditor.tools.blur.radius;
    blurSigma.value = photoEditor.tools.blur.sigma;
  };

  photoEditor.tools.crop.onAfterDisable = () => {
    cropActions.classList.add('hide');
  };

  contrastValue.oninput = (e) => {
    photoEditor.tools.contrast.value = e.target.value;
  };

  const afterEnableContrast = photoEditor.tools.contrast.onAfterEnable;
  photoEditor.tools.contrast.onAfterEnable = () => {
    if (afterEnableContrast) {
      afterEnableContrast.call(photoEditor.tools.contrast);
    }

    contrastSettings.classList.remove('hide');
    contrastValue.value = photoEditor.tools.contrast.value;
  };

  photoEditor.tools.contrast.onAfterDisable = () => {
    contrastSettings.classList.add('hide');
  };


  brightnessValue.oninput = (e) => {
    photoEditor.tools.brightness.value = e.target.value;
  };

  const afterEnableBrightness = photoEditor.tools.brightness.onAfterEnable;
  photoEditor.tools.brightness.onAfterEnable = () => {
    if (afterEnableBrightness) {
      afterEnableBrightness.call(photoEditor.tools.brightness);
    }

    brightnessSettings.classList.remove('hide');
    brightnessValue.value = photoEditor.tools.brightness.value;
  };

  photoEditor.tools.brightness.onAfterDisable = () => {
    brightnessSettings.classList.add('hide');
  };

});
