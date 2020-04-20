const development =
    process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'qa';

module.exports = {
  presets: [
    ['babel-preset-bold-cs',
      { development },
    ]],
};
