module.exports = {
  setupFiles: [
    'jest-canvas-mock',
  ],

  transform: {
    '\\.[jt]sx?$': ['babel-jest', {
      rootMode: 'upward',
    }],
  },

  testEnvironment: 'jsdom',
};
