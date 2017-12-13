import validateSource from './validateSource';

export default function validateOptions(options) {
  if (typeof options !== 'object') {
    throw new Error('PhotoEditor options should be an object');
  }

  if (options === null) {
    throw new Error('PhotoEditor options can\'t be null');
  }

  if (typeof options.tools !== 'object') {
    throw new Error('PhotoEditor tools should be an object');
  }

  if (options.tools === null) {
    throw new Error('PhotoEditor tools can\'t be null');
  }

  if (options.onChangeState && typeof options.onChangeState !== 'function') {
    throw new Error('"onChangeState" should be a function');
  }

  validateSource(options);
}
