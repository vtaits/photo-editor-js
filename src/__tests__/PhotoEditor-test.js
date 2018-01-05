import PhotoEditor from '../PhotoEditor';
import Tool from '../Tool';

/* eslint-disable no-underscore-dangle */
class SyncPhotoEditor extends PhotoEditor {
  _init() {
    const initialState = this._options.source;

    this._currentState = 0;
    this._states = [initialState];

    this._initTools();
  }
}

/* eslint-disable no-new */
test('should throw an exception if element is not canvas', () => {
  expect(() => {
    new PhotoEditor('test');
  })
    .toThrowError('Element for init PhotoEditor should be a canvas');
});

test('should throw an exception if tools is not object', () => {
  expect(() => {
    new PhotoEditor(document.createElement('canvas'), {
      tools: '123',
    });
  })
    .toThrowError('PhotoEditor tools should be an object');
});

test('should throw an exception if tools is null', () => {
  expect(() => {
    new PhotoEditor(document.createElement('canvas'), {
      tools: null,
    });
  })
    .toThrowError('PhotoEditor tools can\'t be null');
});

test('should throw an exception if onChangeState defined and not a function', () => {
  expect(() => {
    new PhotoEditor(document.createElement('canvas'), {
      tools: {},
      onChangeState: 'test',
    });
  })
    .toThrowError('"onChangeState" should be a function');
});

test('should throw an exception if sourceType is invalid', () => {
  expect(() => {
    new PhotoEditor(document.createElement('canvas'), {
      tools: {},
      sourceType: 'test',
    });
  })
    .toThrowError('"sourceType" should be one of: "current-canvas", "canvas", "img", "base64"');
});

test('should throw an exception if sourceType is "canvas" and source not canvas', () => {
  expect(() => {
    new PhotoEditor(document.createElement('canvas'), {
      tools: {},
      sourceType: 'canvas',
      source: 'test',
    });
  })
    .toThrowError('PhotoEditor source for sourceType "canvas" should be a canvas');
});

test('should throw an exception if sourceType is "img" and source not image', () => {
  expect(() => {
    new PhotoEditor(document.createElement('canvas'), {
      tools: {},
      sourceType: 'img',
      source: 'test',
    });
  })
    .toThrowError('PhotoEditor source for sourceType "img" should be an image');
});

test('should throw an exception if sourceType is "base64" and source not string', () => {
  expect(() => {
    new PhotoEditor(document.createElement('canvas'), {
      tools: {},
      sourceType: 'base64',
      source: null,
    });
  })
    .toThrowError('PhotoEditor source for sourceType "base64" should be a string');
});
/* eslint-enable no-new */

test('should set correct initial state and init tools', async () => {
  const initMock = jest.fn();

  const tool1Mock = jest.fn();
  const tool2Mock = jest.fn();

  class Tool1 extends Tool {
    constructor(options) {
      super(options);
      tool1Mock(options);
    }
  }

  class Tool2 extends Tool {
    constructor(options) {
      super(options);
      tool2Mock(options);
    }
  }

  class WithSeparatedInit extends PhotoEditor {
    // eslint-disable-next-line class-methods-use-this
    _init() {
      initMock();
    }
  }
  const el = document.createElement('canvas');
  const options = {
    tools: {
      tool1: Tool1,
      tool2: Tool2,
    },
    sourceType: 'base64',
    source: 'data:image/png;base64,test',
  };

  const photoEditor = new WithSeparatedInit(el, options);

  expect(initMock.mock.calls.length).toBe(1);

  expect(photoEditor._el).toEqual(el);
  expect(photoEditor._options).toEqual(options);
  expect(photoEditor._enabledToolId).toEqual(null);

  await PhotoEditor.prototype._init.call(photoEditor);

  expect(photoEditor._currentState).toEqual(0);
  expect(photoEditor._states).toEqual([
    'data:image/png;base64,test',
  ]);

  [tool1Mock, tool2Mock].forEach((toolMock) => {
    expect(toolMock.mock.calls.length).toBe(1);

    expect(tool1Mock.mock.calls[0][0]).toEqual({
      el,
      pushState: photoEditor._pushState,
    });
  });

  expect(photoEditor.tools.tool1 instanceof Tool1).toBe(true);
  expect(photoEditor.tools.tool2 instanceof Tool2).toBe(true);
});

test('should save state on pushState', () => {
  const el = document.createElement('canvas');
  const options = {
    tools: {},
    sourceType: 'base64',
    source: 'data:image/png;base64,test',
  };

  const photoEditor = new SyncPhotoEditor(el, options);

  const states = photoEditor._states;

  photoEditor._pushState('data:image/png;base64,test2');

  const newStates = photoEditor._states;

  expect(states !== newStates).toBe(true);

  expect(newStates).toEqual([
    'data:image/png;base64,test',
    'data:image/png;base64,test2',
  ]);
  expect(photoEditor._currentState).toBe(1);
});

test('should save state and slice extra states on pushState', () => {
  const el = document.createElement('canvas');
  const options = {
    tools: {},
    sourceType: 'base64',
    source: 'data:image/png;base64,test',
  };

  const photoEditor = new SyncPhotoEditor(el, options);

  const states = photoEditor._states;

  photoEditor._pushState('data:image/png;base64,test2');
  photoEditor._pushState('data:image/png;base64,test3');
  photoEditor._pushState('data:image/png;base64,test4');
  photoEditor._pushState('data:image/png;base64,test5');

  photoEditor._currentState = 1;
  photoEditor._pushState('data:image/png;base64,test3_new');

  const newStates = photoEditor._states;

  expect(states !== newStates).toBe(true);

  expect(newStates).toEqual([
    'data:image/png;base64,test',
    'data:image/png;base64,test2',
    'data:image/png;base64,test3_new',
  ]);
  expect(photoEditor._currentState).toBe(2);
});

test('should return correct currentState with getCurrentState', () => {
  const el = document.createElement('canvas');
  const options = {
    tools: {},
    sourceType: 'base64',
    source: 'data:image/png;base64,test',
  };

  const photoEditor = new SyncPhotoEditor(el, options);

  photoEditor._pushState('data:image/png;base64,test2');
  photoEditor._pushState('data:image/png;base64,test3');
  photoEditor._pushState('data:image/png;base64,test4');
  photoEditor._pushState('data:image/png;base64,test5');

  expect(photoEditor.getCurrentState()).toBe('data:image/png;base64,test5');
});

test('should enable tool', () => {
  const el = document.createElement('canvas');
  const options = {
    tools: {
      tool1: Tool,
      tool2: Tool,
    },
    sourceType: 'base64',
    source: 'data:image/png;base64,test',
  };

  const photoEditor = new SyncPhotoEditor(el, options);

  photoEditor.enableTool('tool1');

  expect(photoEditor._enabledToolId).toBe('tool1');
  expect(photoEditor.tools.tool1.enabled).toBe(true);
  expect(photoEditor.tools.tool2.enabled).toBe(false);

  photoEditor.enableTool('tool2');
  expect(photoEditor._enabledToolId).toBe('tool2');
  expect(photoEditor.tools.tool1.enabled).toBe(false);
  expect(photoEditor.tools.tool2.enabled).toBe(true);
});

test('should disable enabled tool', () => {
  const el = document.createElement('canvas');
  const options = {
    tools: {
      tool1: Tool,
      tool2: Tool,
    },
    sourceType: 'base64',
    source: 'data:image/png;base64,test',
  };

  const photoEditor = new SyncPhotoEditor(el, options);

  photoEditor.enableTool('tool1');
  photoEditor.disableTool();

  expect(photoEditor._enabledToolId).toBe(null);
  expect(photoEditor.tools.tool1.enabled).toBe(false);
  expect(photoEditor.tools.tool2.enabled).toBe(false);
});
