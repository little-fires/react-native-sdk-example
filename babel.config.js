const path = require('path');
const pak = require('./plugins/littlefires/package.json');

module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          [pak.name]: path.join(__dirname, 'plugins', 'littlefires', pak.source),
        },
      },
    ],
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
