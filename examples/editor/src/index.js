import 'babel-polyfill'

import { PhotoEditor } from 'photo-editor';

import {
  Blur,
  Crop,
  Rectangle,
  RotateLeft,
  RotateRight,
} from 'photo-editor/lib/tools';

const blurButtonEl = document.getElementById('blur');
const cropButtonEl = document.getElementById('crop');
const applyCropButtonEl = document.getElementById('apply-crop');
const cancelCropButtonEl = document.getElementById('cancel-crop');
const rectangleButtonEl = document.getElementById('rectangle');
const rotateLeftButtonEl = document.getElementById('rotate-left');
const rotateRightButtonEl = document.getElementById('rotate-right');
const undoButtonEl = document.getElementById('undo');
const redoButtonEl = document.getElementById('redo');
const canvasEl = document.getElementById('canvas');

const photoEditor = new PhotoEditor(canvasEl, {
  tools: {
    blur: Blur,
    crop: Crop,
    rectangle: Rectangle,
    rotateLeft: RotateLeft,
    rotateRight: RotateRight,
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

  if (tool === 'rectangle') {
    rectangleButtonEl.style.border = '2px solid #aa0000';
  }
});

photoEditor.addListener('disableTool', () => {
  blurButtonEl.style.removeProperty('border');
  cropButtonEl.style.removeProperty('border');
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

undoButtonEl.onclick = () => {
  photoEditor.undo();
};

redoButtonEl.onclick = () => {
  photoEditor.redo();
};
