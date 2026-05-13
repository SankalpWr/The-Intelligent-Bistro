module.exports = function (api) {
  const platform = api.caller((caller) => caller && caller.platform);
  api.cache.using(() => platform);
  const isWeb = platform === 'web';

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      ...(isWeb ? [] : ['react-native-reanimated/plugin']),
    ],
  };
};
