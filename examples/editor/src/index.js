import 'babel-polyfill'
import { PhotoEditor } from 'photo-editor';

import Blur from './blur-tool';
import Crop from './crop-tool';
import RotateLeft from './rotate-left-tool';
import RotateRight from './rotate-right-tool';

const blurButtonEl = document.getElementById('blur');
const cropButtonEl = document.getElementById('crop');
const applyCropButtonEl = document.getElementById('apply-crop');
const rotateLeftButtonEl = document.getElementById('rotate-left');
const rotateRightButtonEl = document.getElementById('rotate-right');
const undoButtonEl = document.getElementById('undo');
const redoButtonEl = document.getElementById('redo');
const canvasButtonEl = document.getElementById('canvas');

const photoEditor = new PhotoEditor(canvasButtonEl, {
  tools: {
    blur: Blur,
    crop: Crop,
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
});

photoEditor.addListener('disableTool', () => {
  blurButtonEl.style.removeProperty('border');
  cropButtonEl.style.removeProperty('border');
  applyCropButtonEl.disabled = true;
});

photoEditor.addListener('ready', () => {
  photoEditor.tools.crop.addListener('set', () => {
    applyCropButtonEl.disabled = false;
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
