import 'babel-polyfill'
import { PhotoEditor } from 'photo-editor';

import Blur from './blur-tool';

const blurButtonEl = document.getElementById('blur');
const undoButtonEl = document.getElementById('undo');
const redoButtonEl = document.getElementById('redo');
const canvasButtonEl = document.getElementById('canvas');

const photoEditor = new PhotoEditor(canvasButtonEl, {
  tools: {
    blur: Blur,
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

undoButtonEl.onclick = () => {
  photoEditor.undo();
};

redoButtonEl.onclick = () => {
  photoEditor.redo();
};
