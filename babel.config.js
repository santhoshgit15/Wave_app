module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Required for Reanimated (must be listed last)
      "react-native-reanimated/plugin",
    ],
  };
};
