[![NPM](https://img.shields.io/npm/v/photo-editor.svg)](https://www.npmjs.com/package/photo-editor)
[![dependencies status](https://david-dm.org/vtaits/photo-editor-js/status.svg?path=packages/photo-editor)](https://david-dm.org/vtaits/photo-editor-js?path=packages/photo-editor)
[![devDependencies status](https://david-dm.org/vtaits/photo-editor-js/dev-status.svg?path=packages/photo-editor)](https://david-dm.org/vtaits/photo-editor-js?path=packages/photo-editor&type=dev)

# photo-editor-js
Simple and customizable photo editor for web applications.

## Examples

- [Simple pencil](https://codesandbox.io/s/zrm68oko34)
- [All built-in tools](https://codesandbox.io/s/x768q8r68o)

## Installation

```
npm install photo-editor --save
yarn add photo-editor
```

## Usage

### Init editor

```typescript
import { PhotoEditor } from 'photo-editor';

const photoEditor = new PhotoEditor(canvasEl, options);
```

`canvasEl` - canvas DOM-element for edit image.

`options`:

| Parameter | Required | Description |
| -------- | ------------ | -------- |
| tools | + | Object with keys is id-s of tools, and values is classes of tools. |
| sourceType | - | Type of source of initial image. Allowed values: `current-canvas`, `canvas` (other canvas), `img` (image from page), `base64`. Default value is `current-canvas`. |
| source | if `sourceType` is not `current-canvas` | Source of initial image. Not used if sourceType is `current-canvas`. If `canvas`then `HTMLCanvasElement`, if `img`, then `HTMLImageElement`, if `base64`, then base64-string. |

### Creating new tool

```typescript
import { Tool } from 'photo-editor';

class MyTool extends Tool {
  ...
}
```

Properties of base class:

| Name | Description |
| -------- | -------- |
| el | canvas-element that used for drawing. |
| enabled | Is current tool enabled. |

Methods of base class:

| Name | Arguments | Description |
| -------- | --------- | -------- |
| pushState | base64-string | Save state for ability to return with `undo` and `redo` methods of editor. |
| updateState | base64-string | Change last saved state. |
| disable | - | Disable tool. |

Methods of tool:

| Name | Description |
| -------- | -------- |
| onBeforeDisable | Called before disabling of tool. |
| onAfterDisable | Called after disabling of tool. |
| onBeforeEnable | Called before enabling of tool. |
| onAfterEnable | Called after enabling of tool. |
| onBeforeDestroy | Called before destroy of tool. |

`Tool` extends [EventEmitter](https://github.com/primus/eventemitter3).

### Usage of editor

#### Methods

| Name | Arguemtns | Description |
| -------- | --------- | -------- |
| getCurrentState | - | Get base64 of last saved state (initial state if not exists). |
| enableTool | id of tool | Enable tool by id. If other tool enabled it will be disabled. |
| disableTool | - | Disable enabled tool. |
| toggleTool | id of tool | If this tool enabled, disable it. If other tool enabled it will be disabled. |
| undo | - | Return editor to previous state. |
| redo | - | Return editor to next state. |

#### Events

`PhotoEditor` extends [EventEmitter](https://github.com/primus/eventemitter3).

| Name of event | Arguments | When triggered |
| ---------------- | --------- | -------- |
| ready | - | After init editor, init all tools, initial image was drawed on canvas. |
| enableTool | toolId (id of enabled tool) | After enabling tool. |
| disableTool | - | After disabling tool. |

#### Access to tools

All tools of editor allowed by own key in `tools` parameter, e.g.

```typescript
import { PhotoEditor } from 'photo-editor';
import { Crop } from 'photo-editor/tools';

const photoEditor = new PhotoEditor(canvasEl, {
  tools: {
    crop: Crop,
  },
});

photoEditor.tools.crop.applyCrop();
```

## Built-in tools

```typescript
import {
  Blur,
  Brightness,
  Crop,
  Contrast,
  Rectangle,
  RotateLeft,
  RotateRight,
} from 'photo-editor/tools';
```

### Blur

Blur part of image with brush.

### Brightness

Change brightness of full image.

### Crop

Crop image. First step is select area with rectangle, second step is call `applyCrop` method for apply change.

#### Events

| Name | Arguments | When triggered |
| ---------------- | --------- | -------- |
| set | - | After selecting rectangle area. |
| unset | - | After canceling selection. |

### Contrast

Change contrast of full image.

### Rectangle

Draw red rectangle.

### RotateLeft

Rotate 90 degrees counterclockwise. Triggered instantly after enabling.

### RotateRight

Rotate 90 degrees clockwise. Triggered instantly after enabling.
