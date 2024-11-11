module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        runtime: "classic",
        pragma: "VDom.createElement",
        pragmaFrag: "VDom.Fragment",
      },
    ],
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
  ],
};
