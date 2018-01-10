import 'babel-polyfill'
import { PhotoEditor } from 'photo-editor';

import Blur from './blur-tool';
import RotateLeft from './rotate-left-tool';
import RotateRight from './rotate-right-tool';

const blurButtonEl = document.getElementById('blur');
const rotateLeftButtonEl = document.getElementById('rotate-left');
const rotateRightButtonEl = document.getElementById('rotate-right');
const undoButtonEl = document.getElementById('undo');
const redoButtonEl = document.getElementById('redo');
const canvasButtonEl = document.getElementById('canvas');

const photoEditor = new PhotoEditor(canvasButtonEl, {
  tools: {
    blur: Blur,
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
});

photoEditor.addListener('disableTool', () => {
  blurButtonEl.style.removeProperty('border');
});

blurButtonEl.onclick = () => {
  photoEditor.toggleTool('blur');
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
