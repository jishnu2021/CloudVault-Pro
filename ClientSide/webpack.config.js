const path = require('path');
const flowbiteReact = require("flowbite-react/plugin/webpack");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",

  entry: {
    main: "./src/main.tsx",
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "app-bundle.js" // <--- Will be compiled to this single file
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },

  plugins: [flowbiteReact()]
};