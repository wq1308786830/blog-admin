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
  // Add Babel configuration to support React Compiler
  babel: {
    presets: [
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      // ⚠️ Important: React Compiler plugin must be first
      'babel-plugin-react-compiler',
    ],
  },
};
