const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
//#1DA57A

module.exports = {
  plugins: [
    {
      plugin: MonacoWebpackPlugin,
      options: {
        languages: ['json'],
      },
    },
  ],
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
