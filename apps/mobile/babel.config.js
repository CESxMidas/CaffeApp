module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // expo-router lives in apps/mobile/node_modules only — babel-preset-expo at repo root
    // cannot resolve it, so the router plugin must be registered explicitly.
    plugins: [require('babel-preset-expo/build/expo-router-plugin').expoRouterBabelPlugin],
  };
};
