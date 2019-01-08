import { PhotoEditor } from 'photo-editor';

import Pencil from './pencil-tool';

const pencilButtonEl = document.getElementById('pencil');
const undoButtonEl = document.getElementById('undo');
const redoButtonEl = document.getElementById('redo');
const canvasEl = document.getElementById('canvas');

const photoEditor = new PhotoEditor(canvasEl, {
  tools: {
    pencil: Pencil,
  },
});

photoEditor.addListener('enableTool', (tool) => {
  if (tool === 'pencil') {
    pencilButtonEl.style.border = '2px solid #aa0000';
  }
});

photoEditor.addListener('disableTool', () => {
  pencilButtonEl.style.removeProperty('border');
});

pencilButtonEl.onclick = () => {
  photoEditor.toggleTool('pencil');
};

undoButtonEl.onclick = () => {
  photoEditor.undo();
};

redoButtonEl.onclick = () => {
  photoEditor.redo();
};
