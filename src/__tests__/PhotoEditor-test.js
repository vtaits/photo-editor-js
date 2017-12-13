import PhotoEditor from '../PhotoEditor';

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
