import { EventEmitter } from 'fbemitter';

import Tool from '../Tool';

const toolOptions = {
  el: document.createElement('canvas'),
  pushState: () => {},
  disable: () => {},
  touch: () => {},
};

/* eslint-disable no-new */
test('should throw an exception if options is not object', () => {
  expect(() => {
    new Tool('test');
  })
    .toThrowError('Tool options should be an object');
});

test('should throw an exception if options is null', () => {
  expect(() => {
    new Tool(null);
  })
    .toThrowError('Tool options can\'t be null');
});

test('should throw an exception if element is not canvas', () => {
  expect(() => {
    new Tool({});
  })
    .toThrowError('Element for init Tool should be a canvas');
});

test('should throw an exception if pushState is not a function', () => {
  expect(() => {
    new Tool({
      el: document.createElement('canvas'),
    });
  })
    .toThrowError('Tool option "pushState" should be a function');
});

test('should throw an exception if disable is not a function', () => {
  expect(() => {
    new Tool({
      el: document.createElement('canvas'),
      pushState: () => {},
    });
  })
    .toThrowError('Tool option "disable" should be a function');
});

test('should throw an exception if touch is not a function', () => {
  expect(() => {
    new Tool({
      el: document.createElement('canvas'),
      pushState: () => {},
      disable: () => {},
    });
  })
    .toThrowError('Tool option "touch" should be a function');
});

test('should be disabled after init', () => {
  const tool = new Tool(toolOptions);

  expect(tool.enabled).toEqual(false);
});

test('should extend EventEmitter', () => {
  const tool = new Tool(toolOptions);

  expect(tool instanceof EventEmitter).toEqual(true);
});

test('should enable tool', () => {
  const tool = new Tool(toolOptions);

  tool.enableFromEditor();

  expect(tool.enabled).toEqual(true);
});

test('should call hooks on enable tool', () => {
  const mockFnBefore = jest.fn();
  const mockFnAfter = jest.fn();

  class CustomTool extends Tool {
    onBeforeEnable() {
      expect(this.enabled).toEqual(false);
      mockFnBefore();
    }

    onAfterEnable() {
      expect(this.enabled).toEqual(true);
      mockFnAfter();
    }
  }

  const tool = new CustomTool(toolOptions);

  tool.enableFromEditor();

  expect(mockFnBefore.mock.calls.length).toEqual(1);
  expect(mockFnAfter.mock.calls.length).toEqual(1);
});

test('should disable tool', () => {
  const tool = new Tool(toolOptions);

  tool.enableFromEditor();
  tool.disableFromEditor();

  expect(tool.enabled).toEqual(false);
});

test('should call hooks on disableFromEditor tool', () => {
  const mockFnBefore = jest.fn();
  const mockFnAfter = jest.fn();

  class CustomTool extends Tool {
    onBeforeDisable() {
      expect(this.enabled).toEqual(true);
      mockFnBefore();
    }

    onAfterDisable() {
      expect(this.enabled).toEqual(false);
      mockFnAfter();
    }
  }

  const tool = new CustomTool(toolOptions);

  tool.enableFromEditor();
  tool.disableFromEditor();

  expect(mockFnBefore.mock.calls.length).toEqual(1);
  expect(mockFnAfter.mock.calls.length).toEqual(1);
});

test('should call hook on destroy tool', () => {
  const mockFnDestroy = jest.fn();

  class CustomTool extends Tool {
    onBeforeDestroy = mockFnDestroy;
  }

  const tool = new CustomTool(toolOptions);

  tool.destroy();

  expect(mockFnDestroy.mock.calls.length).toEqual(1);
});
/* eslint-enable no-new */
