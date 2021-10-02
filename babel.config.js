module.exports = {
  env: {
    cjs: {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-env',
      ],
    },

    es: {
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],
      ],
    },

    test: {
      presets: [
        '@babel/preset-typescript',
        '@babel/preset-env',
      ],
    },
  },

  plugins: [
    '@babel/plugin-proposal-class-properties',

    // https://github.com/babel/babel/issues/10261
    ['@babel/plugin-transform-runtime', {
      version: '7.12.5',
    }],
  ],
};
