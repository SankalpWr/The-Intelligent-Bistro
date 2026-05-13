module.exports = function (api) {
  api.cache(true);
  const platform = api.caller((caller) => caller && caller.platform);
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
