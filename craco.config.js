const CracoAntDesignPlugin = require('craco-antd');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');


module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#1DA57A',
        },
      },
    },
  ],
};